import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {RegisterRequest} from '../../../../core/models/register-request.model';

/**
 * Standalone component responsible for handling new user registration.
 *
 * Key Features:
 * - Uses **Reactive Forms** for robust input validation (email format, password length, etc.).
 * - Manages UI state (loading, error messages) using **Angular Signals** for better performance.
 * - Implements an "Auto-Login" flow: upon successful registration, the user is automatically
 * authenticated (token saved) and redirected to the Dashboard.
 */
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  // Dependency injections
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router  = inject(Router);

  // signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Handles the form submission for user registration.
   * Validates the input, manages the loading state, and redirects to the Dashboard upon success.
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: RegisterRequest = this.registerForm.value;

    this.authService.register(request).subscribe({
      next: () => {
        console.log('User registered successfully.');
        this.router.navigate(['/dashboard']);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

}
