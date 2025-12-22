import {inject, Injectable} from '@angular/core';
import {AuthResponse, LoginRequest} from '../../models/auth.models';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RegisterRequest} from '../../models/register-request.model'

/**
 * Service responsible for managing user authentication and session state.
 * Handles API communication for login and token storage mechanism.
 */
@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  // TODO: Move this to environment.ts for production readiness
  private readonly API_URL = 'http://localhost:8080/api/v1/auth';

  /** Key used to store the JWT token in the browser's LocalStorage. */
  private readonly TOKEN_KEY = 'auth_token';

  /**
   * Authenticates the user with the provided credentials.
   * Uses the `tap` operator to automatically persist the JWT token upon a successful response.
   * @param request - The login payload containing email and password.
   * @returns An Observable containing the authentication response (token).
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_URL + '/authenticate', request).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  /**
   * Registers a new user and immediately establishes a session.
   * Automatically saves the returned token to enable "auto-login" after registration.
   * @param request - The registration payload (name, email, password).
   * @returns An Observable of the response.
   */
  register(request: RegisterRequest): Observable<any> {
    return this.http.post<AuthResponse>(this.API_URL +'/register', request).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  /**
   * Persists the JWT token to the browser's LocalStorage.
   * Security Note:
   * Currently using LocalStorage for MVP. For higher security,
   * consider refactoring to HttpOnly Cookies to mitigate XSS risks.
   * @param token - The raw JWT string.
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Terminates the user session by removing the token from storage.
   * Should be called when the user clicks "Logout".
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Checks if the user is currently authenticated based on token existence.
   * @returns `true` if a token exists, otherwise `false`.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retrieves the current token.
   * This will be used by the HTTP Interceptor to attach the token to headers.
   * @returns The token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
