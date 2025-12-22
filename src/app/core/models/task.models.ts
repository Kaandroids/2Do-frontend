/**
 * Defines the priority levels for a task.
 */
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Represents the Task Data Transfer Object (DTO) received from the Backend API.
 * This interface mirrors the structure of the `Task` entity in the Java backend.
 * Data Integrity Rules:
 * - `id`: Always present (@Id).
 * - `title`: Always present (@NotBlank).
 * - `userId`: Always present (@NotBlank).
 * - `completed`: Always present (primitive boolean in Java).
 * - Others: Can be null/undefined depending on user input.
 */
export interface TaskResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  /**
   * The deadline for the task.
   * Format: ISO 8601 String (e.g., "2023-12-25T14:30:00") directly from Java `LocalDateTime`.
   */
  dueDate?: string;
  priority?: Priority;
  completed: boolean;
}

/**
 * Represents the payload required to create a new task.
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
