import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth/auth.service';
import {LoginRequest} from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)

  loginForm: FormGroup;
  isSubmitted = false;

  constructor(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) return;

    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: (response) => {
        alert('Login Successfully!');
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

  }

}
