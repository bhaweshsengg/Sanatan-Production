import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Attaches the stored session token to API requests so the backend can
 * authorize admin-only actions (approve / reject / delist / delete).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith('/api/') || req.url.startsWith(environment.apiBaseUrl);
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (isApiRequest && token) {
    return next(
      req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    );
  }
  return next(req);
};
