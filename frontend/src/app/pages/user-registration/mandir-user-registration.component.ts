import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface RelationOption {
  id: number;
  relationshipName: string;
}

interface TempleOption {
  id: number;
  mandir_name: string;
}

@Component({
  selector: 'app-mandir-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100 px-4 py-10">
      <div class="mx-auto max-w-3xl rounded-2xl bg-white shadow-lg">
        <div class="border-b border-slate-200 p-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Temple Access</p>
              <h1 class="mt-2 text-3xl font-bold text-slate-900">Mandir Registration</h1>
            </div>
            <a routerLink="/" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Home
            </a>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 p-6 sm:p-8">
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">First Name</label>
              <input formControlName="firstName" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="First Name" />
              <div *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid" class="mt-1 text-sm text-red-600">
                First name is required.
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
              <input formControlName="lastName" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Last Name" />
              <div *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid" class="mt-1 text-sm text-red-600">
                Last name is required.
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" formControlName="email" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="you@example.com" />
              <div *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="mt-1 text-sm text-red-600">
                Enter a valid email.
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Mobile</label>
              <input formControlName="mobile" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="+91 98765 43210" />
              <div *ngIf="form.get('mobile')?.touched && form.get('mobile')?.invalid" class="mt-1 text-sm text-red-600">
                Mobile number is required.
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Relation to Mandir</label>
              <select formControlName="relationId" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200">
                <option value="">Select relation</option>
                <option *ngFor="let option of relationOptions" [value]="option.id">{{ option.relationshipName }}</option>
              </select>
              <div *ngIf="form.get('relationId')?.touched && form.get('relationId')?.invalid" class="mt-1 text-sm text-red-600">
                Please select a relation.
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Mandir</label>
              <input list="mandir-options" formControlName="mandirSearch" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Search Mandir" />
              <datalist id="mandir-options">
                <option *ngFor="let temple of temples" [value]="temple.mandir_name"></option>
              </datalist>
              <div *ngIf="form.get('mandirSearch')?.touched && form.get('mandirSearch')?.invalid" class="mt-1 text-sm text-red-600">
                Please select a Mandir.
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
            <button type="button" (click)="cancel()" class="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" [disabled]="submitting || form.invalid" class="rounded-lg bg-orange-600 px-5 py-2.5 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300">
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="message" class="fixed bottom-4 right-4 rounded-lg px-4 py-3 text-sm font-medium shadow-lg" [ngClass]="messageType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
        {{ message }}
      </div>
    </div>
  `,
})
export class MandirUserRegistrationComponent implements OnInit {
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  form: FormGroup;
  relationOptions: RelationOption[] = [];
  temples: TempleOption[] = [];
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      relationId: ['', [Validators.required]],
      mandirSearch: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadRelations();
    this.loadMandirs();
  }

  loadRelations(): void {
    this.http.get<any>(`${this.apiUrl}/public/user-registration/relations`).subscribe({
      next: (response) => {
        this.relationOptions = response?.data ?? [];
      },
      error: () => {
        this.showMessage('Unable to load relation options.', 'error');
      },
    });
  }

  loadMandirs(): void {
    this.http.get<any>(`${this.apiUrl}/public/temple`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : response?.data ?? [];
        this.temples = data.map((temple: any) => ({
          id: Number(temple.id),
          mandir_name: temple.mandir_name,
        }));
      },
      error: () => {
        this.showMessage('Unable to load mandirs.', 'error');
      },
    });
  }

  cancel(): void {
    this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const selectedTemple = this.temples.find((temple) => temple.mandir_name.trim().toLowerCase() === this.form.value.mandirSearch.trim().toLowerCase());
    if (!selectedTemple) {
      this.showMessage('Please select a valid Mandir from the list.', 'error');
      return;
    }

    this.submitting = true;
    const payload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      mobile: this.form.value.mobile,
      relationId: Number(this.form.value.relationId),
      mandirId: Number(selectedTemple.id),
    };

    this.http.post(`${this.apiUrl}/public/user-registration`, payload, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();
        this.showMessage('Registration submitted successfully. It is pending admin approval.', 'success');
      },
      error: (error) => {
        this.submitting = false;
        const errMessage = error?.error?.message || 'Could not save your registration.';
        this.showMessage(errMessage, 'error');
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
