import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task.service/task.service';
import { GroupService } from '../../../core/services/group.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AiTaskResponse, CreateTaskRequest, TaskResponse } from '../../../core/models/task.models';
import { Group, GroupMember } from '../../../core/models/group.models';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { VoiceRecordingService } from '../../../core/services/task.service/voice-recording.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GroupsPage } from '../../groups/groups-page/groups-page';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    GroupsPage,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly groupService = inject(GroupService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly voiceService = inject(VoiceRecordingService);
  private readonly http = inject(HttpClient);

  taskList = signal<TaskResponse[]>([]);
  isLoading = signal<boolean>(false);
  isRecording = computed(() => this.voiceService.isRecording());
  isProcessing = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // View state
  activeView = signal<'dashboard' | 'tasks' | 'groups'>('dashboard');

  currentUserName = this.authService.getCurrentUserFullName();
  pendingTaskList = computed(() => this.taskList().filter((t) => !t.completed));
  pendingTaskCount = computed(() => this.pendingTaskList().length);
  completedTaskCount = computed(() => this.taskList().filter((t) => t.completed).length);

  // Group state
  myGroups = signal<Group[]>([]);
  activeGroupId = signal<number | null>(null);
  selectedGroup = computed(() =>
    this.myGroups().find((g) => g.id === this.activeGroupId()) ?? null
  );
  groupMembers = signal<GroupMember[]>([]);
  formMembers = signal<GroupMember[]>([]);

  createTaskForm: FormGroup;

  constructor() {
    this.createTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      description: [''],
      priority: ['MEDIUM'],
      dueDate: [''],
      isForGroup: [false],
      groupId: [null],
      assigneeId: [null],
      assigneeIds: [[] as number[]],
      isPrivate: [false],
    });

    this.createTaskForm.get('isForGroup')!.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.createTaskForm.patchValue({ groupId: null, assigneeIds: [], isPrivate: false });
        this.formMembers.set([]);
      }
    });

    this.createTaskForm.get('groupId')!.valueChanges.subscribe((gid) => {
      this.formMembers.set([]);
      this.createTaskForm.patchValue({ assigneeIds: [], isPrivate: false });
      if (gid) {
        this.groupService.getGroupMembers(Number(gid)).subscribe({
          next: (members) => this.formMembers.set(members.filter(m => !m.isOwner)),
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadGroups();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks(this.activeGroupId() ?? undefined).subscribe({
      next: (data) => {
        this.taskList.set(data.content);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 403 || error.status === 401) {
          this.authService.clearSession();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  loadGroups(): void {
    this.groupService.getMyGroups().subscribe({
      next: (groups) => this.myGroups.set(groups),
    });
  }

  loadGroupMembers(): void {
    const gid = this.activeGroupId();
    if (gid == null) {
      this.groupMembers.set([]);
      return;
    }
    this.groupService.getGroupMembers(gid).subscribe({
      next: (members) => this.groupMembers.set(members),
    });
  }

  selectGroup(id: number | null): void {
    this.activeGroupId.set(id);
    this.activeView.set('tasks');
    this.loadTasks();
    this.loadGroupMembers();
  }

  isAssigned(userId: number): boolean {
    return (this.createTaskForm.get('assigneeIds')!.value as number[]).includes(userId);
  }

  toggleAssignee(userId: number): void {
    const ctrl = this.createTaskForm.get('assigneeIds')!;
    const current: number[] = [...(ctrl.value as number[])];
    const idx = current.indexOf(userId);
    idx === -1 ? current.push(userId) : current.splice(idx, 1);
    ctrl.setValue(current);
  }

  taskGroupName(groupId: number | undefined): string {
    if (!groupId) return 'Me';
    return this.myGroups().find((g) => g.id === groupId)?.name ?? 'Me';
  }

  get pageTitle(): string {
    return this.selectedGroup()?.name ?? 'My Tasks';
  }

  onGroupCreated(group: Group): void {
    this.myGroups.update((list) => [...list, group]);
    this.selectGroup(group.id);
  }

  onGroupsChanged(): void {
    this.loadGroups();
  }

  onGroupDeleted(): void {
    const id = this.activeGroupId();
    if (id != null) {
      this.groupService.deleteGroup(id).subscribe({
        next: () => {
          this.myGroups.update((list) => list.filter((g) => g.id !== id));
          this.selectGroup(null);
        },
        error: () => alert('Failed to delete group.'),
      });
    }
  }

  openGroupSettings(): void {
    const btn = document.getElementById('openGroupSettingsBtn');
    if (btn) btn.click();
  }

  onCreateTask(): void {
    if (this.createTaskForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.createTaskForm.value;

    const request: CreateTaskRequest = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      dueDate: formValue.dueDate || undefined,
      groupId: formValue.isForGroup ? (formValue.groupId ?? undefined) : (this.activeGroupId() ?? undefined),
      assigneeId: formValue.assigneeId || undefined,
      assigneeIds: formValue.assigneeIds?.length ? formValue.assigneeIds : undefined,
      isPrivate: formValue.isPrivate ?? false,
    };

    this.taskService
      .createTask(request)
      .pipe(finalize(() => { this.isLoading.set(false); this.isSubmitting.set(false); }))
      .subscribe({
        next: (data) => {
          this.taskList.update((prev) => [data, ...prev]);
          this.createTaskForm.reset({ priority: 'MEDIUM', isForGroup: false, assigneeIds: [], isPrivate: false });
          this.formMembers.set([]);
          const closeBtn = document.getElementById('closeModalBtn');
          if (closeBtn) closeBtn.click();
        },
        error: (err) => {
          const msg = err?.error?.message || 'Failed to create task. Please try again later.';
          alert(msg);
        },
      });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.taskList.update((prev) => prev.filter((item) => item.id !== id));
      });
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  onToggleTask(task: TaskResponse): void {
    this.taskList.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
    this.taskService.toggleTaskStatus(task).subscribe();
  }

  async onAiTaskClick(): Promise<void> {
    if (this.isRecording()) {
      await this.stopAndAnalyze();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording(): Promise<void> {
    try {
      await this.voiceService.startRecording();
    } catch {
      alert('Please grant microphone permission!');
    }
  }

  private async stopAndAnalyze(): Promise<void> {
    this.isProcessing.set(true);
    const audioFile = await this.voiceService.stopRecording();
    const formData = new FormData();
    formData.append('file', audioFile);

    this.http
      .post<AiTaskResponse>(`${environment.apiUrl}/tasks/ai-generate`, formData)
      .pipe(finalize(() => this.isProcessing.set(false)))
      .subscribe({
        next: (res) => {
          if (res.isTaskDetected) {
            this.createTaskForm.patchValue({
              title: res.title,
              description: res.description,
              priority: res.priority || 'MEDIUM',
              dueDate: res.dueDate ? this.formatDateForInput(res.dueDate) : '',
            });
            setTimeout(() => {
              const openStandardBtn = document.querySelector(
                '[data-bs-target="#addTaskModal"]'
              ) as HTMLElement;
              openStandardBtn?.click();
            }, 400);
          } else {
            alert("Sorry, I couldn't recognize a task. Could you please try again?");
          }
        },
        error: (error) => console.error(error),
      });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    return dateString.substring(0, 16);
  }

  onCloseAiModal(): void {
    if (this.isRecording()) {
      this.voiceService.abortRecording();
    }
    this.isProcessing.set(false);
  }
}
