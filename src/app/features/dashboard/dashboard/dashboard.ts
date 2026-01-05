import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {TaskService} from '../../../core/services/task.service/task.service';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AiTaskResponse, CreateTaskRequest, TaskResponse} from '../../../core/models/task.models';
import {DatePipe} from '@angular/common';
import {finalize} from 'rxjs';
import {VoiceRecordingService} from '../../../core/services/task.service/voice-recording.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  // Dependency injections
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder)
  private readonly voiceService = inject(VoiceRecordingService)
  private readonly http = inject(HttpClient);



  /** Holds the list of tasks fetched from the API. */
  taskList = signal<TaskResponse[]>([]);

  /** Loading state for the task list. */
  isLoading = signal<boolean>(false);

  isRecording = computed(() => this.voiceService.isRecording());
  isProcessing = signal<boolean>(false);

  /** Reactive Form for creating a new task. */
  createTaskForm: FormGroup;

  /** Loading state for the save button (prevent double clicks). */
  isSubmitting = signal<boolean>(false);

  constructor(){
    this.createTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      description: [''],
      priority: ['MEDIUM'],
      dueDate: [''],
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  /**
   * Fetches tasks from the backend.
   */
  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      {
        next: (data) => {
          this.taskList.set(data.content);
          this.isLoading.set(false);
          console.log('Logged in.')
        },
        error: error => {
          console.error('Failed to load tasks: ' + error);
          this.isLoading.set(false);
          if (error.status === 403 || error.status === 401) {
            this.authService.logout();
            this.router.navigate(['login']);
          }
        }
      }
    );
  }

  /**
   * Handles the "Save Task" form submission.
   */
  onCreateTask(): void {
    if (this.createTaskForm.invalid) return;

    this.isSubmitting.set(true);
    const request: CreateTaskRequest = this.createTaskForm.value;

    this.taskService.createTask(request)
      .pipe(
        finalize(() => {
          //  Reset UI state
          this.isLoading.set(false);
          this.isSubmitting.set(false);
        })
      )
      .subscribe({
      next: (data) => {
        console.info('Task created successfully: ' + data);

        // Optimistic UI Update: Add to list immediately
        this.taskList.update(prev => [data, ...prev]);

        // Reset form
        this.createTaskForm.reset();

        // Close Bootstrap Modal manually
        const closeBtn = document.getElementById('closeModalBtn');
        if (closeBtn) closeBtn.click();
      },
      error: error => {
        console.error('Failed to create task: ' + error);
        alert('Failed to create task. Please try again later');
      }
    });
  }

  /**
   * Permanently deletes a task by ID after user confirmation.
   * Updates the local list upon success to avoid page reload.
   */
  onDelete(id: number): void {
    if(confirm('Are you sure you want to delete this task?')) {
      // Optimistic delete: remove from UI first (or after success)
      this.taskService.deleteTask(id).subscribe(() => {
        this.taskList.update(prev => prev.filter(item => item.id !== id));
      });
    }
  }

  /**
   * Logs out the current user by clearing the session and redirects to the login page.
   */
  onLogout(): void {
    this.authService.logout().subscribe();
    this.router.navigate(['/login']);
  }

  /**
   * Toggles task completion status with Optimistic UI update.
   */
  onToggleTask(task: TaskResponse) {
    this.taskList.update(
      tasks => tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t),
    );

    this.taskService.toggleTaskStatus(task).subscribe();
  }


  async onAiTaskClick() {
    if (this.isRecording()) {
      await this.stopAndAnalyze();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      await this.voiceService.startRecording();
    } catch (error) {
      alert('Please grant microphone permission!');
    }
  }

  private async stopAndAnalyze() {
    this.isProcessing.set(true);
    const audioFile = await this.voiceService.stopRecording();

    const formData = new FormData();
    formData.append('file', audioFile);

    this.http.post<AiTaskResponse>(`${environment.apiUrl}/tasks/ai-generate`, formData)
      .pipe(finalize(() => this.isProcessing.set(false)))
    .subscribe({
      next: (res) => {
        if (res.isTaskDetected) {
          this.createTaskForm.patchValue({
            title: res.title,
            description: res.description,
            priority: res.priority || 'MEDIUM',
            dueDate: res.dueDate ? this.formatDateForInput(res.dueDate) : ''
          });
          setTimeout(() => {
            const openStandardBtn = document.querySelector('[data-bs-target="#addTaskModal"]') as HTMLElement;
            openStandardBtn?.click();
          }, 400);
        } else {
          alert('Sorry, I couldn\'t recognize a task. Could you please try again?');
        }
      },
      error: error => {
        console.error(error);
      }
    })
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




























