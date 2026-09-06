import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

/**
 * Attaches the stored session token to API requests so the backend can
 * authorize admin-only actions (approve / reject / delist / delete).
 * Also intercepts 401s to refresh the token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith('/api/') || req.url.startsWith(environment.apiBaseUrl);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

  let authReq = req;
  if (isApiRequest && token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  const authService = inject(AuthService);
  const http = inject(HttpClient);

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && isApiRequest) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const userDataStr = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;
          const userData = userDataStr ? JSON.parse(userDataStr) : null;
          const refresh = userData?.refresh;

          if (refresh) {
            return http.post<any>(`${environment.apiBaseUrl}/refresh`, { refresh }).pipe(
              switchMap((res) => {
                isRefreshing = false;
                const newAccessToken = res.data.access;
                
                // Update local storage
                localStorage.setItem('authToken', newAccessToken);
                userData.access = newAccessToken;
                localStorage.setItem('userData', JSON.stringify(userData));
                
                refreshTokenSubject.next(newAccessToken);
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${newAccessToken}` } }));
              }),
              catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
              })
            );
          } else {
            isRefreshing = false;
            authService.logout();
            return throwError(() => error);
          }
        } else {
          return refreshTokenSubject.pipe(
            filter(t => t != null),
            take(1),
            switchMap(jwt => {
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
