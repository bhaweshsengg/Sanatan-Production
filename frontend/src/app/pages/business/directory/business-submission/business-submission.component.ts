import { Component, signal, OnInit, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

interface Submission {
  id: string;
  name: string;
  category: string;
  location: string;
  contact: string;
  phone: string;
  hours: string;
  submitted: Date;
  status: 'pending' | 'approved' | 'rejected' | 'delisted';
  tags: string[];
  type: 'business' | 'temple';
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 font-sans">
      <!-- Nav Menu -->
      <nav aria-label="Main" class="relative z-10 flex w-full items-center justify-center p-4 bg-white shadow-sm">
        <ul data-orientation="horizontal" class="flex list-none items-center justify-center space-x-2 sm:space-x-4">
          <li>
            <a class="group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900" routerLink="/">Home</a>
          </li>
          <li>
            <a class="group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900" routerLink="/business/admin/business-submissions">Admin</a>
          </li>
        </ul>
      </nav>

      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Business & Temple Management Admin</h1>
            <p class="text-black-700">Review submissions and manage approved businesses & temples</p>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-black-700">Business Submissions</p>
                  <p class="text-2xl font-bold text-blue-600">{{ totalBusinessSubmissions() }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-blue-600">
                  <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-black-700">Temple Submissions</p>
                  <p class="text-2xl font-bold text-purple-600">{{ totalTempleSubmissions() }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-purple-600">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                  <path d="M9 22V12h6v10"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-black-700">Pending Temple</p>
                  <p class="text-2xl font-bold text-yellow-600">{{ totalPendingReview() }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-yellow-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
              </div>
            </div>
          </div>

          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-black-700">Total Approved</p>
                  <p class="text-2xl font-bold text-green-600">{{ totalApproved() }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-green-600">
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="space-y-6">
          <div role="tablist" class="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-gray-200 p-1 text-white shadow-sm">
            <button
              type="button"
              role="tab"
              (click)="setTab('all')"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:text-gray-900"
              [ngClass]="{'bg-white text-gray-900 shadow-sm': activeTab() === 'all'}"
            >
              All
            </button>
            <button
              type="button"
              role="tab"
              (click)="setTab('pending-businesses')"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:text-gray-900"
              [ngClass]="{'bg-white text-gray-900 shadow-sm': activeTab() === 'pending-businesses'}"
            >
              Pending Businesses
            </button>
            <button
              type="button"
              role="tab"
              (click)="setTab('approved-businesses')"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:text-gray-900"
              [ngClass]="{'bg-white text-gray-900 shadow-sm': activeTab() === 'approved-businesses'}"
            >
              Approved Businesses
            </button>
            <button
              type="button"
              role="tab"
              (click)="setTab('pending-temples')"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:text-gray-900"
              [ngClass]="{'bg-white text-gray-900 shadow-sm': activeTab() === 'pending-temples'}"
            >
              Pending Temples
            </button>
            <button
              type="button"
              role="tab"
              (click)="setTab('approved-temples')"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:text-gray-900"
              [ngClass]="{'bg-white text-gray-900 shadow-sm': activeTab() === 'approved-temples'}"
            >
              Approved Temples
            </button>
          </div>

          <!-- Search and Filter Section -->
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="search">Search</label>
                  <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 absolute left-3 top-3 text-gray-400">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10" id="search" placeholder="Search by name, category, or details…" [(ngModel)]="searchQuery">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submission List -->
          @if (loading()) {
            <div class="p-4 text-center text-gray-500">
              Loading submissions...
            </div>
          } @else if (filteredItems().length === 0) {
            <div class="p-4 text-center text-gray-500">
              No submissions found for this view.
            </div>
          } @else {
            <div class="space-y-4">
              @for (item of filteredItems(); track item.id) {
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div class="p-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                      <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                        <p class="text-black-700 mb-2">{{ item.category }}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          @if (item.location) {
                            <span class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {{ item.location }}
                            </span>
                          }
                          @if (item.submitted) {
                            <span class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                              </svg>
                              {{ item.submitted | date:'mediumDate' }}
                            </span>
                          }
                        </div>
                      </div>
                      <div class="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                        @if (item.status === 'approved' || item.status === 'delisted' || item.status === 'rejected') {
                          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                          [ngClass]="{'text-green-600 border-green-600': item.status === 'approved', 'text-red-600 border-red-600': item.status === 'rejected' || item.status === 'delisted'}">
                            @if (item.status === 'approved') {
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                              Approved
                            } @else if (item.status === 'rejected') {
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1">
                                <line x1="18" x2="6" y1="6" y2="18"></line>
                                <line x1="6" x2="18" y1="6" y2="18"></line>
                              </svg>
                              Rejected
                            } @else if (item.status === 'delisted') {
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                              Delisted
                            }
                          </div>
                        }
                        @if (item.status === 'pending') {
                          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-yellow-600 border-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            Pending
                          </div>
                        }
                        @if (item.status === 'pending') {
                          <button (click)="approveSubmission(item)" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-9 rounded-md px-3 gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                            Approve
                          </button>
                        }
                        @if (item.status === 'pending') {
                          <button (click)="rejectSubmission(item)" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-9 rounded-md px-3 gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <line x1="18" x2="6" y1="6" y2="18"></line>
                              <line x1="6" x2="18" y1="6" y2="18"></line>
                            </svg>
                            Reject
                          </button>
                        }
                        @if (item.status === 'approved') {
                          <button (click)="delistSubmission(item)" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-9 rounded-md px-3 gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"></path>
                              <line x1="10" x2="10" y1="11" y2="17"></line>
                              <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                            Delist
                          </button>
                        }
                      </div>
                    </div>
                    <p class="text-gray-700 text-sm line-clamp-2 mb-3">{{ item.description }}</p>
                    <div class="flex items-center justify-between flex-wrap gap-2">
                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        @if (item.contact) {
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            {{ item.contact }}
                          </span>
                        }
                        @if (item.phone) {
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            {{ item.phone }}
                          </span>
                        }
                        @if (item.hours) {
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {{ item.hours }}
                          </span>
                        }
                      </div>
                      <div class="flex gap-1 flex-wrap">
                        @for (tag of item.tags; track tag) {
                          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs">{{ tag }}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Using Tailwind for all styling, so no custom CSS needed here. */
  `]
})
export class BusinessSubmissionComponent implements OnInit {
  // Inject HttpClient
  private http = inject(HttpClient);
  
  // Base API URL - Update this to match your backend
  private apiUrl = environment.apiBaseUrl;

  // Signals for component state
  activeTab = signal<'all' | 'pending-businesses' | 'approved-businesses' | 'pending-temples' | 'approved-temples'>('all');
  submissions = signal<Submission[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  // Toast properties
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  showToast = signal(false);

  // Computed signals for dynamic statistics and filtering
  totalBusinessSubmissions = computed(() => this.submissions().filter(s => s.type === 'business').length);
  totalTempleSubmissions = computed(() => this.submissions().filter(s => s.type === 'temple').length);
  totalPendingReview = computed(() => this.submissions().filter(s => s.status === 'pending').length);
  totalApproved = computed(() => this.submissions().filter(s => s.status === 'approved').length);

  // The main filtered list to be displayed in the template
  filteredItems = computed(() => {
    const allItems = this.submissions();
    let list: Submission[] = [];

    // Filter by tab
    switch (this.activeTab()) {
      case 'all':
        list = allItems;
        break;
      case 'pending-businesses':
        list = allItems.filter(s => s.type === 'business' && s.status === 'pending');
        break;
      case 'approved-businesses':
        list = allItems.filter(s => s.type === 'business' && s.status === 'approved');
        break;
      case 'pending-temples':
        list = allItems.filter(s => s.type === 'temple' && s.status === 'pending');
        break;
      case 'approved-temples':
        list = allItems.filter(s => s.type === 'temple' && s.status === 'approved');
        break;
    }

    // Further filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      list = list.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    return list;
  });

  ngOnInit(): void {
    this.loadData();
  }

  setTab(tab: 'all' | 'pending-businesses' | 'approved-businesses' | 'pending-temples' | 'approved-temples') {
    this.activeTab.set(tab);
  }

  updateSubmissionStatus(item: Submission, newStatus: 'approved' | 'rejected' | 'delisted') {
    let url = '';
    const payload = { status: newStatus === 'approved' ? 'Approved' : newStatus === 'rejected' ? 'Rejected' : 'Delist' };

    if (item.type === 'business') {
      // Business API
      url = `${this.apiUrl}/business/${item.id}/status`;
    } else if (item.type === 'temple') {
      // Temple API
      url = `${this.apiUrl}/temple/${item.id}/status`;
    }

    this.http.patch(url, payload).subscribe({
      next: () => {
        // Update local state after successful API call
        this.submissions.update(subs =>
          subs.map(s => s.id === item.id ? { ...s, status: newStatus } : s)
        );
        
        // Show success toast
        this.showToastMessage(
          `${item.type === 'business' ? 'Business' : 'Temple'} "${item.name}" has been ${newStatus} successfully.`,
          'success'
        );
this.loadData()
         },
      error: (err) => {
        // Show error toast
        this.showToastMessage(
          `Failed to update ${item.type === 'business' ? 'business' : 'temple'} "${item.name}". Please try again.`,
          'error'
        );
        
        console.error(`Failed to update ${item.name}:`, err);
      }
    });
  }

  approveSubmission(item: Submission) {
    this.updateSubmissionStatus(item, 'approved');
  }

  rejectSubmission(item: Submission) {
    this.updateSubmissionStatus(item, 'rejected');
  }

  delistSubmission(item: Submission) {
    this.updateSubmissionStatus(item, 'delisted');
  }

  // API Methods
  getBusinesses(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/business`)
      .pipe(
        map((response: any) => {
          const businessData = Array.isArray(response) ? response : response?.data ?? [];
          const businesses = Array.isArray(businessData) ? businessData : [];
          
          return businesses.map(business =>
            this.transformBusinessFromAPIResponse(business)
          );
        }),
        catchError(this.handleError<any[]>('getBusinesses', []))
      );
  }

  getTemples(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/temple`)
      .pipe(
        map((response: any) => {
          const temples = Array.isArray(response) ? response : response?.data ?? [];
          return Array.isArray(temples)
            ? temples.map(temple => this.transformTempleFromAPIResponse(temple))
            : [];
        }),
        catchError(this.handleError<any[]>('getTemples', []))
      );
  }

  // Load data from both APIs
  private loadData(): void {
    this.loading.set(true);
    
    forkJoin({
      businesses: this.getBusinesses(),
      temples: this.getTemples()
    }).subscribe({
      next: (data) => {
        const allSubmissions = [...data.businesses, ...data.temples];
        this.submissions.set(allSubmissions);
        this.loading.set(false);
        
        // Show success toast if data loaded successfully
        this.showToastMessage('Data loaded successfully', 'success');
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading.set(false);
        
        // Show error toast
        this.showToastMessage('Failed to load data. Please try again.', 'error');
      }
    });
  }

  // Transform business API response to Submission interface
  private transformBusinessFromAPIResponse(business: any): Submission {
    return {
      id: business.id.toString(),
      name: business.businessName,
      category: business.category,
      location: `${business.address}, ${business.city}`,
      contact: business.email,
      phone: business.phone,
      hours: business.operatingHours,
      submitted: new Date(business.created_at),
      status: this.mapStatus(business.status),
      tags: this.extractBusinessTags(business),
      type: 'business',
      description: business.description
    };
  }

  // Transform temple API response to Submission interface
  private transformTempleFromAPIResponse(temple: any): Submission {
    return {
      id: temple.id.toString(),
      name: temple.mandir_name,
      category: temple.main_deity?.name || 'Temple',
      location: `${temple.full_address}, ${temple.city?.name}`,
      contact: temple.email,
      phone: temple.phone_no,
      hours: temple.opening_hours,
      submitted: new Date(), // Temple API doesn't have created_at, using current date
      status: this.mapStatus(temple.status),
      tags: this.extractTempleTags(temple),
      type: 'temple',
      description: temple.description
    };
  }

  // Map API status to component status
private mapStatus(apiStatus: string | null | undefined): 'pending' | 'approved' | 'rejected' | 'delisted' {
  const statusLower = (apiStatus || '').toLowerCase();
  switch (statusLower) {
    case 'pending':
      return 'pending';
    case 'approved':
    case 'active':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'delisted':
      return 'delisted';
    default:
      return 'pending';
  }
}

  // Extract tags for business
  private extractBusinessTags(business: any): string[] {
    const tags: string[] = [];
    
    if (business.services) {
      // Split services by comma and add as tags
      const services = business.services.split(',').map((s: string) => s.trim());
      tags.push(...services);
    }
    
    if (business.specialOffers) {
      tags.push('special-offers');
    }
    
    if (business.website) {
      tags.push('website');
    }
    
    return tags;
  }

  // Extract tags for temple
  private extractTempleTags(temple: any): string[] {
    const tags: string[] = [];
    
    if (temple.service_offered && Array.isArray(temple.service_offered)) {
      tags.push(...temple.service_offered);
    }
    
    if (temple.facilities_offered && Array.isArray(temple.facilities_offered)) {
      tags.push(...temple.facilities_offered);
    }
    
    if (temple.year_established) {
      tags.push(`est-${temple.year_established}`);
    }
    
    return tags;
  }

  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return new Observable<T>(observer => {
        observer.next(result as T);
        observer.complete();
      });
    };
  }

  // Show toast message
  private showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    
    setTimeout(() => {
      this.showToast.set(false);
      this.toastMessage.set('');
    }, 3000);
  }
}