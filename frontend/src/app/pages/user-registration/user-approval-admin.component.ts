import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service';

interface UserRegistrationRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  status: string;
  mandir?: { mandir_name: string };
  relation?: { relationshipName: string };
}

@Component({
  selector: 'app-user-approval-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 p-6">
      <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Admin</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">User Approvals</h1>
          </div>
        </div>

        <div *ngIf="loading" class="rounded-xl bg-white p-6 text-slate-600 shadow-sm">Loading pending approvals...</div>

        <div *ngIf="!loading && registrations.length === 0" class="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
          No pending registrations.
        </div>

        <div *ngIf="!loading && registrations.length > 0" class="space-y-4">
          <div *ngFor="let item of registrations" class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="space-y-2">
                <div class="text-lg font-semibold text-slate-900">{{ item.firstName }} {{ item.lastName }}</div>
                <div class="text-sm text-slate-600">{{ item.email }} · {{ item.mobile }}</div>
                <div class="text-sm text-slate-600">Mandir: <span class="font-medium text-slate-800">{{ item.mandir?.mandir_name || 'N/A' }}</span></div>
                <div class="text-sm text-slate-600">Relation: <span class="font-medium text-slate-800">{{ item.relation?.relationshipName || 'N/A' }}</span></div>
              </div>

              <div class="flex gap-2">
                <button (click)="approve(item.id)" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Approve
                </button>
                <button (click)="reject(item.id)" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="fixed bottom-4 right-4 rounded-lg px-4 py-3 text-sm font-medium shadow-lg" [ngClass]="messageType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
        {{ message }}
      </div>
    </div>
  `,
})
export class UserApprovalAdminComponent implements OnInit {
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  registrations: UserRegistrationRow[] = [];
  loading = true;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');

    this.http.get<any>(`${this.apiUrl}/user-registration/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (response) => {
        this.registrations = response?.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Unable to load registrations.', 'error');
      },
    });
  }

  approve(id: number): void {
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');
    this.http.patch(`${this.apiUrl}/user-registration/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        this.showMessage('Registration approved.', 'success');
        this.loadPending();
      },
      error: (error) => {
        const details = error?.error?.message || 'Approval failed.';
        this.showMessage(details, 'error');
      },
    });
  }

  reject(id: number): void {
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');
    this.http.patch(`${this.apiUrl}/user-registration/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        this.showMessage('Registration rejected.', 'success');
        this.loadPending();
      },
      error: (error) => {
        const details = error?.error?.message || 'Rejection failed.';
        this.showMessage(details, 'error');
      },
    });
  }

  private showMessage(value: string, type: 'success' | 'error'): void {
    this.message = value;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
