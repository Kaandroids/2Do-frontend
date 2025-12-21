import {inject, Injectable} from '@angular/core';
import {AuthResponse, LoginRequest} from '../../models/auth.models';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/authenticate`, request).pipe(
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
