import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateTaskRequest, Page, TaskResponse} from '../../models/task.models';
import {environment} from '../../../../environments/environment';

/**
 * Service responsible for managing Task-related HTTP operations.
 * * * Architecture Note:
 * This service is purely responsible for data fetching and mutation.
 * It does NOT handle Authentication headers manually.
 * The `AuthInterceptor` automatically injects the JWT token into every request.
 */
@Injectable({providedIn: 'root'})
export class TaskService {
  private readonly http = inject(HttpClient)

  private readonly API_URL = `${environment.apiUrl}/tasks`;

  /**
   * Fetches the list of tasks belonging to the authenticated user.
   * * * Security:
   * Backend uses the JWT token from the header to identify the user
   * and returns only the tasks owned by that specific user.
   * @returns An Observable array of `TaskResponse` objects.
   */
  getTasks(): Observable<Page<TaskResponse>> {
    return this.http.get<Page<TaskResponse>>(this.API_URL)
  }

  /**
   * Sends a request to create a new task.
   * * * Payload Structure:
   * The `userId` is intentionally omitted from the request body.
   * The Backend extracts the user identity securely from the Security Context (JWT).
   * @param task - The payload containing task details (title, description, priority, etc.).
   * @returns An Observable of the created `TaskResponse`.
   */
  createTask(task: CreateTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.API_URL, task);
  }

  /**
   * Deletes a specific task by its unique ID.
   * @param id - The unique identifier of the task to be deleted.
   * @returns An Observable that completes when deletion is successful.
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(this.API_URL + '/' + id);
  }

  /**
   * Toggles the task's completion status.
   * Creates a modified copy of the task and sends a full update (PUT) to the server.
   */
  toggleTaskStatus(task: TaskResponse): Observable<TaskResponse> {
    const updatedTask: TaskResponse = {...task, completed: !task.completed};
    return this.http.put<TaskResponse>(this.API_URL + '/' + task.id, updatedTask);
  }

}
