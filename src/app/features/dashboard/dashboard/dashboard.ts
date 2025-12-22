import {Component, inject, OnInit, signal} from '@angular/core';
import {TaskService} from '../../../core/services/task.service/task.service';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateTaskRequest, TaskResponse} from '../../../core/models/task.models';
import {DatePipe} from '@angular/common';
import {finalize} from 'rxjs';

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

  /** Holds the list of tasks fetched from the API. */
  taskList = signal<TaskResponse[]>([]);

  /** Loading state for the task list. */
  isLoading = signal<boolean>(false);

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
    this.authService.logout();
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

}




























