import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth.service'

/**
 * Functional Interceptor to attach JWT tokens to outgoing requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Dependency injection
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // ⚠️ CRITICAL: HttpRequests are Immutable!
    // We cannot modify 'req' directly. We must clone it.
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Pass the cloned request with header
    return next(clonedReq);
  }
  // If no token, pass the original request
  return next(req);
}
