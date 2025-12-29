import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth/auth.service';
import {LoginRequest} from '../../../core/models/auth.models';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)

  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  constructor(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.isSubmitted.set(true);
    this.errorMessage.set(null)

    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage.set('Invalid login credentials');
        } else {
          this.errorMessage.set('A connection error occurred. Please try again later.');
        }
        console.error('Login Error:', error);
      },
    });

  }

}
