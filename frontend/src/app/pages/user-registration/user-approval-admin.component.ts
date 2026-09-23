import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service';

interface UserRegistrationRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  subscription?: string;
  termsAccepted?: boolean;
  termsAcceptedAt?: string | null;
  status: string;
  mandir?: { mandir_name: string };
  relation?: { relationshipName: string };
  reviewedByUserId?: number | null;
  reviewedAt?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  adminNoteDraft?: string;
  processing?: boolean;
}

@Component({
  selector: 'app-user-approval-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-100 p-6">
      <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Administration</p>
            <h1 class="mt-1 text-3xl font-bold text-slate-900">Temple Devotee Approvals</h1>
            <p class="mt-1 text-sm text-slate-600">Review pending Temple Devotee registration requests</p>
          </div>
          <button
            (click)="loadPending()"
            class="self-start sm:self-auto rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition flex items-center gap-2"
          >
            <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div *ngIf="loading" class="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p class="mt-2 text-sm font-medium">Loading pending devotee registrations...</p>
        </div>

        <div *ngIf="!loading && registrations.length === 0" class="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm">
          <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-3 text-lg font-semibold text-slate-800">All caught up!</h3>
          <p class="mt-1 text-sm text-slate-500">There are no pending devotee registrations awaiting review.</p>
        </div>

        <div *ngIf="!loading && registrations.length > 0" class="space-y-5">
          <div
            *ngFor="let item of registrations"
            class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
          >
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-3 flex-1">
                <div class="flex flex-wrap items-center gap-2.5">
                  <h2 class="text-xl font-bold text-slate-900">{{ item.firstName }} {{ item.lastName }}</h2>
                  <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    {{ item.status }}
                  </span>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
                    [ngClass]="item.subscription === 'Yes' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-slate-50 text-slate-600 ring-slate-500/20'"
                  >
                    Subscription: {{ item.subscription || 'No' }}
                  </span>
                  <span
                    *ngIf="item.termsAccepted !== undefined"
                    class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                  >
                    ✓ Terms Accepted
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Email:</span>
                    <a href="mailto:{{ item.email }}" class="text-orange-600 hover:underline">{{ item.email }}</a>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Mobile:</span>
                    <span class="text-slate-900">{{ item.mobile }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Temple:</span>
                    <span class="font-semibold text-slate-900">{{ item.mandir?.mandir_name || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Role:</span>
                    <span class="text-slate-800">{{ item.relation?.relationshipName || 'Temple Devotee' }}</span>
                  </div>
                  <div *ngIf="item.createdAt" class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Submitted:</span>
                    <span class="text-slate-700">{{ item.createdAt | date:'medium' }}</span>
                  </div>
                  <div *ngIf="item.termsAcceptedAt" class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Terms Consent:</span>
                    <span class="text-emerald-700 font-medium">{{ item.termsAcceptedAt | date:'medium' }}</span>
                  </div>
                  <div *ngIf="item.reviewedByUserId" class="flex items-center gap-2">
                    <span class="font-medium text-slate-500">Reviewed By ID:</span>
                    <span class="text-slate-700">{{ item.reviewedByUserId }}</span>
                  </div>
                </div>

                <!-- Admin Notes Input -->
                <div class="pt-2">
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Review Notes (optional)</label>
                  <input
                    type="text"
                    [(ngModel)]="item.adminNoteDraft"
                    placeholder="Add an internal note or reason for decision..."
                    class="w-full max-w-xl rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex sm:flex-row lg:flex-col gap-2.5 shrink-0 self-end lg:self-center">
                <button
                  (click)="approve(item)"
                  [disabled]="item.processing"
                  class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  <svg *ngIf="!item.processing" class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  (click)="reject(item)"
                  [disabled]="item.processing"
                  class="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition"
                >
                  <svg *ngIf="!item.processing" class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        *ngIf="message"
        class="fixed bottom-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl transition-all"
        [ngClass]="messageType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
      >
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
    this.loading = true;
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');

    this.http
      .get<any>(`${this.apiUrl}/user-registration/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response) => {
          this.registrations = response?.data ?? [];
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Unable to load pending registrations.';
          this.showMessage(msg, 'error');
        },
      });
  }

  approve(item: UserRegistrationRow): void {
    item.processing = true;
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');
    const body = { notes: item.adminNoteDraft ? item.adminNoteDraft.trim() : null };

    this.http
      .patch(`${this.apiUrl}/user-registration/${item.id}/approve`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.showMessage(`Registration for ${item.firstName} ${item.lastName} approved successfully.`, 'success');
          this.loadPending();
        },
        error: (error) => {
          item.processing = false;
          const details = error?.error?.message || error?.error?.error || 'Approval failed.';
          this.showMessage(details, 'error');
        },
      });
  }

  reject(item: UserRegistrationRow): void {
    item.processing = true;
    const token = this.authService.getUserData()?.access || localStorage.getItem('authToken');
    const body = { notes: item.adminNoteDraft ? item.adminNoteDraft.trim() : null };

    this.http
      .patch(`${this.apiUrl}/user-registration/${item.id}/reject`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.showMessage(`Registration for ${item.firstName} ${item.lastName} rejected.`, 'success');
          this.loadPending();
        },
        error: (error) => {
          item.processing = false;
          const details = error?.error?.message || error?.error?.error || 'Rejection failed.';
          this.showMessage(details, 'error');
        },
      });
  }

  private showMessage(value: string, type: 'success' | 'error'): void {
    this.message = value;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 4500);
  }
}
