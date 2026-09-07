// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private http = inject(HttpClient);

  constructor() { }

  login(token: string, userData: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    const userData = this.getUserData();
    const refresh = userData?.refresh;

    if (refresh) {
      this.http.post(`${environment.apiBaseUrl}/logout`, { refresh })
        .pipe(
          finalize(() => this.clearLocalSession())
        )
        .subscribe({
          error: (err) => console.error('Logout API failed', err)
        });
    } else {
      this.clearLocalSession();
    }
  }

  private clearLocalSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}