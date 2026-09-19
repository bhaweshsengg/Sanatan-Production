import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface AdminReligiousArticle {
  id: number;
  title: string;
  sanskritTitle?: string;
  category: string;
  deity?: string;
  source?: string;
  summary: string;
  sanskritText?: string;
  transliteration?: string;
  englishMeaning?: string;
  significance?: string;
  bestTimeToChant?: string;
  verses?: Array<{ sanskrit: string; transliteration: string; english: string }>;
  status: 'Draft' | 'Published' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-admin-religious-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800">
                Admin Control
              </span>
              <span class="text-xs text-gray-500">Sanatan NZ Portal</span>
            </div>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">Religious Articles &amp; Sacred Texts</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage Vedic mantras, chalisas, stotrams, and sacred scriptures for devotee worship and contemplation.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              routerLink="/religious-contents"
              target="_blank"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>🕉️</span>
              <span>View Public Page</span>
            </a>
            <button
              type="button"
              (click)="openCreateModal()"
              class="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-all transform hover:scale-[1.02]"
            >
              <span>📜</span>
              <span>Add Sacred Article</span>
            </button>
          </div>
        </div>

        <!-- Notification Messages -->
        <div *ngIf="successMessage" class="mb-6 flex items-center justify-between rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 shadow-sm">
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span class="text-sm font-medium">{{ successMessage }}</span>
          </div>
          <button (click)="successMessage = ''" class="text-green-600 hover:text-green-800 text-sm">✕</button>
        </div>

        <div *ngIf="errorMessage" class="mb-6 flex items-center justify-between rounded-lg bg-red-50 p-4 text-red-800 border border-red-200 shadow-sm">
          <div class="flex items-center gap-2">
            <span>⚠️</span>
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>
          <button (click)="errorMessage = ''" class="text-red-600 hover:text-red-800 text-sm">✕</button>
        </div>

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Sacred Texts</div>
            <div class="mt-2 text-3xl font-bold text-gray-900">{{ articles.length }}</div>
            <div class="mt-1 text-xs text-gray-500">All registered articles &amp; mantras</div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-green-600">Published Live</div>
            <div class="mt-2 text-3xl font-bold text-green-600">{{ publishedCount }}</div>
            <div class="mt-1 text-xs text-gray-500">Available to public devotees</div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-amber-600">Drafts</div>
            <div class="mt-2 text-3xl font-bold text-amber-600">{{ draftCount }}</div>
            <div class="mt-1 text-xs text-gray-500">Work in progress</div>
          </div>
        </div>

        <!-- Filter and Search Bar -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Search</label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="applyFilters()"
                  placeholder="Search by title, Sanskrit text, deity, or summary..."
                  class="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Category</label>
              <select
                [(ngModel)]="selectedCategory"
                (ngModelChange)="applyFilters()"
                class="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Status</label>
              <select
                [(ngModel)]="selectedStatus"
                (ngModelChange)="applyFilters()"
                class="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Articles Table -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div *ngIf="loading" class="py-16 text-center">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-500">Loading religious articles...</p>
          </div>

          <div *ngIf="!loading && filteredArticles.length === 0" class="py-16 text-center">
            <span class="text-4xl">🕉️</span>
            <p class="mt-2 text-base font-semibold text-gray-900">No religious articles found</p>
            <p class="text-sm text-gray-500">Try adjusting your filters or add a new sacred article.</p>
            <button
              (click)="openCreateModal()"
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
            >
              Add First Article
            </button>
          </div>

          <div *ngIf="!loading && filteredArticles.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3.5 font-semibold text-gray-900">Article / Shloka</th>
                  <th class="px-6 py-3.5 font-semibold text-gray-900">Category &amp; Deity</th>
                  <th class="px-6 py-3.5 font-semibold text-gray-900">Source</th>
                  <th class="px-6 py-3.5 font-semibold text-gray-900">Status</th>
                  <th class="px-6 py-3.5 font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr *ngFor="let item of filteredArticles" class="hover:bg-orange-50/30 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-bold text-gray-900">{{ item.title }}</div>
                    <div *ngIf="item.sanskritTitle" class="text-xs font-serif text-orange-800 mt-0.5">{{ item.sanskritTitle }}</div>
                    <p class="text-xs text-gray-500 line-clamp-1 mt-1">{{ item.summary }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [ngClass]="{
                        'bg-orange-100 text-orange-800': item.category === 'Mantras',
                        'bg-amber-100 text-amber-800': item.category === 'Chalisas',
                        'bg-red-100 text-red-800': item.category === 'Stotrams',
                        'bg-emerald-100 text-emerald-800': item.category === 'Scriptures',
                        'bg-blue-100 text-blue-800': item.category === 'Philosophy',
                        'bg-purple-100 text-purple-800': item.category === 'Rituals'
                      }"
                    >
                      {{ item.category }}
                    </span>
                    <div *ngIf="item.deity" class="text-xs text-gray-500 mt-1 font-medium">{{ item.deity }}</div>
                  </td>
                  <td class="px-6 py-4 text-xs text-gray-600">
                    {{ item.source || '—' }}
                    <div *ngIf="item.bestTimeToChant" class="text-gray-400 mt-0.5">⏱ {{ item.bestTimeToChant }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <button
                      type="button"
                      (click)="toggleStatus(item)"
                      title="Click to toggle status"
                      class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition hover:opacity-80"
                      [ngClass]="{
                        'bg-green-100 text-green-800 border border-green-300': item.status === 'Published',
                        'bg-amber-100 text-amber-800 border border-amber-300': item.status === 'Draft',
                        'bg-gray-100 text-gray-800 border border-gray-300': item.status === 'Archived'
                      }"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" [ngClass]="{
                        'bg-green-600': item.status === 'Published',
                        'bg-amber-600': item.status === 'Draft',
                        'bg-gray-600': item.status === 'Archived'
                      }"></span>
                      <span>{{ item.status }}</span>
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      (click)="openEditModal(item)"
                      class="rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                      title="Edit article"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      (click)="confirmDelete(item)"
                      class="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                      title="Delete article"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- CREATE / EDIT MODAL -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 my-8 overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-100 p-6 bg-gradient-to-r from-orange-50 to-amber-50">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-orange-700">Religious Content Form</span>
              <h2 class="text-xl font-bold text-gray-900 mt-0.5">
                {{ isEditing ? 'Edit Sacred Article' : 'Add New Sacred Article' }}
              </h2>
            </div>
            <button
              type="button"
              (click)="closeModal()"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>

          <!-- Modal Form Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Article / Mantra Title <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.title"
                  placeholder="e.g. Maha Mrityunjaya Mantra"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <!-- Sanskrit Title -->
              <div>
                <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Sanskrit / Devanagari Title
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.sanskritTitle"
                  placeholder="e.g. महा मृत्युञ्जय मन्त्र"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-serif focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Category -->
              <div>
                <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  [(ngModel)]="formData.category"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                >
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
              </div>

              <!-- Deity -->
              <div>
                <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Deity / Presiding Form
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.deity"
                  placeholder="e.g. Lord Shiva, Maa Durga"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <!-- Source -->
              <div>
                <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Scripture / Source
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.source"
                  placeholder="e.g. Rigveda Mandala 7"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Summary -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Summary / Brief Overview <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="formData.summary"
                rows="2"
                placeholder="A concise summary of this sacred hymn or scripture..."
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              ></textarea>
            </div>

            <!-- Best Time to Chant -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Recommended Time To Chant / Study
              </label>
              <input
                type="text"
                [(ngModel)]="formData.bestTimeToChant"
                placeholder="e.g. Brahma Muhurta, Mondays, Navratri, or daily dawn"
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <!-- Mula Sanskrit Text -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                📜 Mula Sanskrit Shloka / Mantra (Devanagari)
              </label>
              <textarea
                [(ngModel)]="formData.sanskritText"
                rows="3"
                placeholder="ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्..."
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base font-serif leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-orange-50/20"
              ></textarea>
            </div>

            <!-- Transliteration -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Pronunciation / Transliteration (IAST)
              </label>
              <textarea
                [(ngModel)]="formData.transliteration"
                rows="2"
                placeholder="Oṁ Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭi-Vardhanam..."
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-xs italic focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-gray-50/50"
              ></textarea>
            </div>

            <!-- English Meaning -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                English Translation &amp; Meaning
              </label>
              <textarea
                [(ngModel)]="formData.englishMeaning"
                rows="3"
                placeholder="Complete English translation and word-by-word devotional explanation..."
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              ></textarea>
            </div>

            <!-- Spiritual Significance -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Spiritual Significance &amp; Practical Benefits
              </label>
              <textarea
                [(ngModel)]="formData.significance"
                rows="3"
                placeholder="Vedic context, spiritual benefits, psychological impact, and traditional significance..."
                class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              ></textarea>
            </div>

            <!-- Publication Status -->
            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Publication Status
              </label>
              <div class="flex items-center gap-4 mt-1">
                <label class="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="Published"
                    class="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Published (Live to Public)</span>
                </label>
                <label class="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="Draft"
                    class="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Draft (Hidden)</span>
                </label>
                <label class="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="Archived"
                    class="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Archived</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-100 p-4 bg-gray-50">
            <button
              type="button"
              (click)="closeModal()"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="saveArticle('Draft')"
              [disabled]="isSaving"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              (click)="saveArticle('Published')"
              [disabled]="isSaving"
              class="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : (isEditing ? 'Update Article' : 'Publish Article') }}
            </button>
          </div>
        </div>
      </div>

      <!-- DELETE CONFIRMATION MODAL -->
      <div *ngIf="articleToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
          <div class="text-3xl text-center mb-3">⚠️</div>
          <h3 class="text-lg font-bold text-gray-900 text-center">Confirm Deletion</h3>
          <p class="mt-2 text-sm text-gray-600 text-center">
            Are you sure you want to delete the sacred article
            <span class="font-semibold text-gray-900">"{{ articleToDelete.title }}"</span>?
            This action cannot be undone.
          </p>
          <div class="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              (click)="articleToDelete = null"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="deleteArticle()"
              [disabled]="isDeleting"
              class="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Article' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  `,
})
export class AdminReligiousArticlesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  articles: AdminReligiousArticle[] = [];
  filteredArticles: AdminReligiousArticle[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  searchQuery = '';
  selectedCategory = 'All';
  selectedStatus = 'All';

  categories = [
    'Mantras',
    'Chalisas',
    'Stotrams',
    'Scriptures',
    'Philosophy',
    'Rituals',
    'General',
  ];

  // Modal State
  showModal = false;
  isEditing = false;
  isSaving = false;
  currentArticleId: number | null = null;

  formData = {
    title: '',
    sanskritTitle: '',
    category: 'Mantras',
    deity: '',
    source: '',
    summary: '',
    sanskritText: '',
    transliteration: '',
    englishMeaning: '',
    significance: '',
    bestTimeToChant: '',
    status: 'Published' as 'Draft' | 'Published' | 'Archived',
  };

  // Delete State
  articleToDelete: AdminReligiousArticle | null = null;
  isDeleting = false;

  get publishedCount(): number {
    return this.articles.filter((a) => a.status === 'Published').length;
  }

  get draftCount(): number {
    return this.articles.filter((a) => a.status === 'Draft').length;
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/religious-article/admin`).subscribe({
      next: (res) => {
        this.articles = res.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        // Fallback to public endpoint if admin endpoint has issue
        this.http.get<any>(`${this.apiUrl}/public/religious-article`).subscribe({
          next: (res) => {
            this.articles = res.data || [];
            this.applyFilters();
            this.loading = false;
          },
          error: (fallbackErr) => {
            this.errorMessage = err?.error?.message || fallbackErr?.error?.message || 'Failed to load religious articles.';
            this.loading = false;
          },
        });
      },
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredArticles = this.articles.filter((article) => {
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        (article.sanskritTitle && article.sanskritTitle.toLowerCase().includes(q)) ||
        (article.deity && article.deity.toLowerCase().includes(q)) ||
        (article.source && article.source.toLowerCase().includes(q)) ||
        article.summary.toLowerCase().includes(q) ||
        (article.sanskritText && article.sanskritText.toLowerCase().includes(q));

      const matchesCat =
        this.selectedCategory === 'All' || article.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' || article.status === this.selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentArticleId = null;
    this.formData = {
      title: '',
      sanskritTitle: '',
      category: 'Mantras',
      deity: '',
      source: '',
      summary: '',
      sanskritText: '',
      transliteration: '',
      englishMeaning: '',
      significance: '',
      bestTimeToChant: '',
      status: 'Published',
    };
    this.showModal = true;
  }

  openEditModal(article: AdminReligiousArticle): void {
    this.isEditing = true;
    this.currentArticleId = article.id;
    this.formData = {
      title: article.title,
      sanskritTitle: article.sanskritTitle || '',
      category: article.category || 'Mantras',
      deity: article.deity || '',
      source: article.source || '',
      summary: article.summary,
      sanskritText: article.sanskritText || '',
      transliteration: article.transliteration || '',
      englishMeaning: article.englishMeaning || '',
      significance: article.significance || '',
      bestTimeToChant: article.bestTimeToChant || '',
      status: article.status,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentArticleId = null;
  }

  saveArticle(overrideStatus?: 'Draft' | 'Published'): void {
    if (!this.formData.title.trim() || !this.formData.summary.trim()) {
      this.errorMessage = 'Please provide both Title and Summary.';
      return;
    }

    if (overrideStatus) {
      this.formData.status = overrideStatus;
    }

    this.isSaving = true;
    const payload = { ...this.formData };

    if (this.isEditing && this.currentArticleId) {
      this.http.put<any>(`${this.apiUrl}/religious-article/${this.currentArticleId}`, payload).subscribe({
        next: () => {
          this.successMessage = `Article "${this.formData.title}" updated successfully!`;
          this.isSaving = false;
          this.closeModal();
          this.loadArticles();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to update religious article.';
          this.isSaving = false;
        },
      });
    } else {
      this.http.post<any>(`${this.apiUrl}/religious-article`, payload).subscribe({
        next: () => {
          this.successMessage = `Article "${this.formData.title}" created successfully!`;
          this.isSaving = false;
          this.closeModal();
          this.loadArticles();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to create religious article.';
          this.isSaving = false;
        },
      });
    }
  }

  toggleStatus(article: AdminReligiousArticle): void {
    const nextStatus = article.status === 'Published' ? 'Draft' : 'Published';
    this.http.patch<any>(`${this.apiUrl}/religious-article/${article.id}/status`, { status: nextStatus }).subscribe({
      next: () => {
        article.status = nextStatus;
        this.successMessage = `Article "${article.title}" status changed to ${nextStatus}.`;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update status.';
      },
    });
  }

  confirmDelete(article: AdminReligiousArticle): void {
    this.articleToDelete = article;
  }

  deleteArticle(): void {
    if (!this.articleToDelete) return;
    this.isDeleting = true;

    this.http.delete<any>(`${this.apiUrl}/religious-article/${this.articleToDelete.id}`).subscribe({
      next: () => {
        this.successMessage = `Article "${this.articleToDelete?.title}" deleted successfully!`;
        this.articleToDelete = null;
        this.isDeleting = false;
        this.loadArticles();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete article.';
        this.isDeleting = false;
      },
    });
  }
}
