import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface AdminBlogPost {
  id: number;
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string | null;
  authorName: string;
  status: 'Draft' | 'Published' | 'Archived';
  tags?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { id: number; username: string; email?: string };
}

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .blog-editor-visual:empty:before {
      content: attr(placeholder);
      color: #9ca3af;
      pointer-events: none;
      display: block;
    }
    .blog-editor-visual h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #111827;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .blog-editor-visual h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #1f2937;
      margin-top: 0.85rem;
      margin-bottom: 0.35rem;
    }
    .blog-editor-visual p {
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
    .blog-editor-visual ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .blog-editor-visual ol {
      list-style-type: decimal;
      margin-left: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .blog-editor-visual li {
      margin-bottom: 0.25rem;
    }
    .blog-editor-visual blockquote {
      border-left: 4px solid #ea580c;
      background-color: #fff7ed;
      padding: 0.5rem 0.85rem;
      margin: 0.85rem 0;
      border-radius: 0.375rem;
      font-style: italic;
      color: #7c2d12;
    }
    .blog-editor-visual a {
      color: #ea580c;
      text-decoration: underline;
    }
    .blog-editor-visual hr {
      margin: 1rem 0;
      border: 0;
      border-top: 1px solid #e5e7eb;
    }
  `],
  template: `
    <main class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
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
            <h1 class="mt-2 text-3xl font-bold text-gray-900">Blog &amp; Article Management</h1>
            <p class="mt-1 text-sm text-gray-600">
              Create, edit, publish, and manage spiritual articles and blog posts for the public Sanatan community.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              routerLink="/blog"
              target="_blank"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>👁️</span>
              <span>View Public Page</span>
            </a>
            <button
              type="button"
              (click)="openCreateModal()"
              class="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-all transform hover:scale-[1.02]"
            >
              <span>✍️</span>
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        <!-- Notification Messages -->
        <div *ngIf="successMessage" class="mb-6 flex items-center justify-between rounded-lg bg-green-50 p-4 text-green-800 border border-green-200">
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span class="text-sm font-medium">{{ successMessage }}</span>
          </div>
          <button (click)="successMessage = ''" class="text-green-600 hover:text-green-800 text-sm">✕</button>
        </div>

        <div *ngIf="errorMessage" class="mb-6 flex items-center justify-between rounded-lg bg-red-50 p-4 text-red-800 border border-red-200">
          <div class="flex items-center gap-2">
            <span>⚠️</span>
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>
          <button (click)="errorMessage = ''" class="text-red-600 hover:text-red-800 text-sm">✕</button>
        </div>

        <!-- Summary Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Posts</div>
            <div class="mt-2 text-3xl font-bold text-gray-900">{{ blogs.length }}</div>
            <div class="mt-1 text-xs text-gray-500">All authored articles</div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-green-600">Published Live</div>
            <div class="mt-2 text-3xl font-bold text-green-600">{{ publishedCount }}</div>
            <div class="mt-1 text-xs text-gray-500">Visible to all devotees</div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-xs font-semibold uppercase tracking-wider text-amber-600">Drafts</div>
            <div class="mt-2 text-3xl font-bold text-amber-600">{{ draftCount }}</div>
            <div class="mt-1 text-xs text-gray-500">Unpublished work-in-progress</div>
          </div>
        </div>

        <!-- Search & Filter Bar -->
        <div class="mb-6 flex flex-col md:flex-row gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="Search posts by title, author, or tags..."
              [(ngModel)]="searchQuery"
              (input)="applyFilters()"
              class="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>

          <div class="flex flex-wrap gap-2">
            <select
              [(ngModel)]="selectedCategory"
              (change)="applyFilters()"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>

            <select
              [(ngModel)]="selectedStatus"
              (change)="applyFilters()"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published Live</option>
              <option value="Draft">Drafts Only</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <!-- Blog Posts Table -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div *ngIf="loading" class="py-16 text-center text-gray-500">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-3"></div>
            <p class="text-sm font-medium">Loading blog articles...</p>
          </div>

          <div *ngIf="!loading" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th class="px-6 py-3.5 text-left">Article</th>
                  <th class="px-6 py-3.5 text-left">Category</th>
                  <th class="px-6 py-3.5 text-left">Author</th>
                  <th class="px-6 py-3.5 text-left">Status</th>
                  <th class="px-6 py-3.5 text-left">Date</th>
                  <th class="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white text-sm">
                <tr *ngFor="let blog of filteredBlogs" class="hover:bg-gray-50/70 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-orange-100 flex items-center justify-center border border-gray-200">
                        <img
                          *ngIf="blog.imageUrl"
                          [src]="resolveImageUrl(blog.imageUrl)"
                          [alt]="blog.title"
                          class="h-full w-full object-cover"
                          (error)="onImageError($event)"
                        />
                        <span *ngIf="!blog.imageUrl" class="text-xl">📿</span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="font-semibold text-gray-900 line-clamp-1" [title]="blog.title">{{ blog.title }}</div>
                        <div class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ blog.excerpt }}</div>
                        <div class="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                          <span>⏱️ {{ blog.readTime || '3 min read' }}</span>
                          <span *ngIf="blog.tags">🏷️ {{ blog.tags }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800 border border-orange-200">
                      {{ blog.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div class="font-medium text-gray-900">{{ blog.authorName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      [ngClass]="{
                        'bg-green-100 text-green-800 border border-green-200': blog.status === 'Published',
                        'bg-amber-100 text-amber-800 border border-amber-200': blog.status === 'Draft',
                        'bg-gray-100 text-gray-700 border border-gray-200': blog.status === 'Archived'
                      }"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" [ngClass]="blog.status === 'Published' ? 'bg-green-600' : 'bg-amber-600'"></span>
                      {{ blog.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {{ blog.publishedAt ? (blog.publishedAt | date:'mediumDate') : (blog.createdAt | date:'mediumDate') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Status Quick Toggle -->
                      <button
                        type="button"
                        (click)="toggleStatus(blog)"
                        class="rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        [ngClass]="blog.status === 'Published' ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200' : 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200'"
                        [title]="blog.status === 'Published' ? 'Change to Draft' : 'Publish live to public page'"
                      >
                        {{ blog.status === 'Published' ? 'Unpublish' : 'Publish' }}
                      </button>

                      <!-- Edit Button -->
                      <button
                        type="button"
                        (click)="openEditModal(blog)"
                        class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>

                      <!-- Delete Button -->
                      <button
                        type="button"
                        (click)="confirmDelete(blog)"
                        class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr *ngIf="filteredBlogs.length === 0">
                  <td colspan="6" class="py-12 text-center text-gray-500">
                    <div class="text-3xl mb-2">📜</div>
                    <p class="font-medium text-gray-700">No blog posts found.</p>
                    <p class="text-xs text-gray-400 mt-1">Try changing search filters or create a new blog post above.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CREATE / EDIT MODAL -->
        <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  {{ isEditing ? 'Edit Blog Post' : 'Create New Blog Post' }}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ isEditing ? 'Update article details, content, or publication status.' : 'Compose and publish a new spiritual article for the community.' }}
                </p>
              </div>
              <button
                type="button"
                (click)="closeModal()"
                class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <!-- Modal Body (Scrollable Form) -->
            <div class="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <!-- Title -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Article Title <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.title"
                  placeholder="e.g. The Science of Mantras: Sacred Sound Vibrations"
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <!-- Category & Author in 2 columns -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.category"
                    class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Author Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.authorName"
                    placeholder="e.g. Acharya Sharma / Sanatan Editorial"
                    class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <!-- Excerpt / Short Summary -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Short Summary / Excerpt <span class="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  [(ngModel)]="formData.excerpt"
                  placeholder="A compelling 1-2 sentence overview shown in cards and previews..."
                  class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                ></textarea>
              </div>

              <!-- Full Content with Rich Text & HTML Formatting -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Full Article Content <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="toggleHtmlMode()"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors shadow-sm cursor-pointer"
                      [ngClass]="isHtmlMode ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                      title="Switch between Visual Rich Text and Raw HTML"
                    >
                      <span>{{ isHtmlMode ? '👁️ Visual Editor' : 'HTML Source Code' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Rich Text Formatting Toolbar -->
                <div class="rounded-t-lg border border-b-0 border-gray-300 bg-gray-100 p-2 flex flex-wrap items-center gap-1 text-xs">
                  <!-- Text Styling -->
                  <div class="flex items-center bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      (click)="formatDoc('bold')"
                      class="px-2.5 py-1 font-bold hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                      title="Bold (Ctrl+B)"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('italic')"
                      class="px-2.5 py-1 italic font-serif hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Italic (Ctrl+I)"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('underline')"
                      class="px-2.5 py-1 underline hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Underline (Ctrl+U)"
                    >
                      U
                    </button>
                  </div>

                  <!-- Headings & Paragraph -->
                  <div class="flex items-center bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      (click)="formatDoc('formatBlock', '<h2>')"
                      class="px-2.5 py-1 font-bold text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('formatBlock', '<h3>')"
                      class="px-2.5 py-1 font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('formatBlock', '<p>')"
                      class="px-2.5 py-1 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Normal Paragraph"
                    >
                      ¶ Body
                    </button>
                  </div>

                  <!-- Lists & Quotes -->
                  <div class="flex items-center bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      (click)="formatDoc('insertUnorderedList')"
                      class="px-2.5 py-1 hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('insertOrderedList')"
                      class="px-2.5 py-1 hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Numbered List"
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('formatBlock', '<blockquote>')"
                      class="px-2.5 py-1 italic hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Blockquote"
                    >
                      “ Quote
                    </button>
                  </div>

                  <!-- Links & Structure -->
                  <div class="flex items-center bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      (click)="promptInsertLink()"
                      class="px-2 py-1 hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                      title="Insert Link"
                    >
                      🔗 Link
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('unlink')"
                      class="px-2 py-1 hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Remove Link"
                    >
                      🚫 Unlink
                    </button>
                    <button
                      type="button"
                      (click)="formatDoc('insertHorizontalRule')"
                      class="px-2 py-1 hover:bg-orange-50 hover:text-orange-600 border-l border-gray-200 transition cursor-pointer"
                      title="Horizontal Divider"
                    >
                      ― Rule
                    </button>
                  </div>

                  <!-- Clear Format -->
                  <button
                    type="button"
                    (click)="formatDoc('removeFormat')"
                    class="px-2 py-1 rounded bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition ml-auto cursor-pointer"
                    title="Clear Formatting"
                  >
                    🧹 Clear
                  </button>
                </div>

                <!-- Visual Mode Editable Area -->
                <div
                  *ngIf="!isHtmlMode"
                  #visualEditor
                  contenteditable="true"
                  (input)="onVisualEditorInput($event)"
                  (blur)="syncFromVisualEditor()"
                  class="w-full min-h-[220px] max-h-[380px] overflow-y-auto rounded-b-lg border border-gray-300 p-4 text-sm font-sans text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white blog-editor-visual shadow-inner"
                  placeholder="Type or format your article content here. Highlight text to format with bold, headings, lists, or blockquotes..."
                ></div>

                <!-- HTML Source Mode Textarea -->
                <textarea
                  *ngIf="isHtmlMode"
                  rows="10"
                  [(ngModel)]="formData.content"
                  placeholder="<p>Write raw HTML content here...</p>"
                  class="w-full rounded-b-lg border border-gray-300 p-4 text-xs font-mono text-gray-800 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-inner leading-relaxed"
                ></textarea>

                <div class="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                  <span>{{ isHtmlMode ? 'Raw HTML editing mode active' : 'Rich Text WYSIWYG mode active' }}</span>
                  <span>Estimated read time: {{ getEstimatedReadTime() }}</span>
                </div>
              </div>

              <!-- Featured Image Upload / URL -->
              <div class="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
                <div class="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Featured Image
                </div>

                <div class="flex flex-col sm:flex-row gap-4 items-start">
                  <!-- File Upload Input -->
                  <div class="flex-1 w-full">
                    <label class="block text-xs text-gray-500 mb-1">Upload New Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      (change)="onFileSelected($event)"
                      class="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                    />
                    <div *ngIf="isUploadingImage" class="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1.5">
                      <div class="h-3 w-3 animate-spin rounded-full border-2 border-orange-600 border-r-transparent"></div>
                      Uploading image...
                    </div>
                  </div>

                  <!-- Or Image URL Input -->
                  <div class="flex-1 w-full">
                    <label class="block text-xs text-gray-500 mb-1">Or Paste Image URL</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.imageUrl"
                      placeholder="https://images.unsplash.com/..."
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <!-- Image Preview -->
                <div *ngIf="formData.imageUrl" class="mt-2 flex items-center gap-3">
                  <div class="h-16 w-24 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img [src]="resolveImageUrl(formData.imageUrl)" alt="Preview" class="h-full w-full object-cover" (error)="onImageError($event)" />
                  </div>
                  <button
                    type="button"
                    (click)="formData.imageUrl = ''"
                    class="text-xs text-red-600 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              </div>

              <!-- Tags, ReadTime, Status in 3 columns -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.tags"
                    placeholder="Gita, Mantras, Dharma"
                    class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Read Time (optional)
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.readTime"
                    placeholder="Auto or e.g. 5 min read"
                    class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Publication Status <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.status"
                    class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-semibold text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    [ngClass]="formData.status === 'Published' ? 'text-green-700 font-bold' : 'text-amber-700 font-bold'"
                  >
                    <option value="Draft">Draft (Hidden from public)</option>
                    <option value="Published">Published (Live to public)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 mt-2">
              <button
                type="button"
                (click)="closeModal()"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  (click)="saveBlog('Draft')"
                  [disabled]="isSaving"
                  class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  (click)="saveBlog('Published')"
                  [disabled]="isSaving"
                  class="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {{ isSaving ? 'Saving...' : (formData.status === 'Published' ? 'Publish Now' : 'Publish Live') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- DELETE CONFIRMATION MODAL -->
        <div *ngIf="blogToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <div class="flex items-center gap-3 text-red-600 mb-3">
              <span class="text-2xl">⚠️</span>
              <h3 class="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            </div>
            <p class="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete <strong>"{{ blogToDelete.title }}"</strong>? This action cannot be undone and will immediately remove the article from the public blog page.
            </p>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                (click)="blogToDelete = null"
                [disabled]="isDeleting"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="deleteConfirmed()"
                [disabled]="isDeleting"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete Article' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
})
export class AdminBlogsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  blogs: AdminBlogPost[] = [];
  filteredBlogs: AdminBlogPost[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  searchQuery = '';
  selectedCategory = 'All';
  selectedStatus = 'All';

  categories = [
    'Philosophy',
    'Scriptures',
    'Vedic Wisdom',
    'Traditions & Rituals',
    'Festival Insights',
    'Mantras & Meditation',
  ];

  // Modal State
  showModal = false;
  isEditing = false;
  isSaving = false;
  isUploadingImage = false;
  currentBlogId: number | null = null;

  @ViewChild('visualEditor') visualEditorRef?: ElementRef<HTMLDivElement>;
  isHtmlMode = false;

  formData = {
    title: '',
    category: 'Philosophy',
    authorName: 'Sanatan NZ Admin',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: '',
    readTime: '',
    status: 'Draft' as 'Draft' | 'Published' | 'Archived',
  };

  // Delete State
  blogToDelete: AdminBlogPost | null = null;
  isDeleting = false;

  get publishedCount(): number {
    return this.blogs.filter((b) => b.status === 'Published').length;
  }

  get draftCount(): number {
    return this.blogs.filter((b) => b.status === 'Draft').length;
  }

  formatDoc(command: string, value: string | null = null): void {
    if (this.isHtmlMode) return;
    this.focusVisualEditor();
    document.execCommand(command, false, value ?? undefined);
    this.syncFromVisualEditor();
  }

  focusVisualEditor(): void {
    if (this.visualEditorRef?.nativeElement) {
      this.visualEditorRef.nativeElement.focus();
    }
  }

  promptInsertLink(): void {
    if (this.isHtmlMode) return;
    const url = prompt('Enter link URL (e.g. https://example.com):');
    if (url && url.trim()) {
      this.formatDoc('createLink', url.trim());
    }
  }

  onVisualEditorInput(event: Event): void {
    const el = event.target as HTMLElement;
    this.formData.content = el.innerHTML;
  }

  syncFromVisualEditor(): void {
    if (this.visualEditorRef?.nativeElement) {
      this.formData.content = this.visualEditorRef.nativeElement.innerHTML;
    }
  }

  syncToVisualEditor(): void {
    if (this.visualEditorRef?.nativeElement) {
      this.visualEditorRef.nativeElement.innerHTML = this.formData.content || '';
    }
  }

  toggleHtmlMode(): void {
    if (!this.isHtmlMode) {
      this.syncFromVisualEditor();
      this.isHtmlMode = true;
    } else {
      this.isHtmlMode = false;
      setTimeout(() => this.syncToVisualEditor(), 0);
    }
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/blog/admin`).subscribe({
      next: (res) => {
        this.blogs = res.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load blog posts.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredBlogs = this.blogs.filter((blog) => {
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.authorName.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.toLowerCase().includes(q));

      const matchesCat =
        this.selectedCategory === 'All' || blog.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' || blog.status === this.selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentBlogId = null;
    this.formData = {
      title: '',
      category: 'Philosophy',
      authorName: 'Sanatan NZ Admin',
      excerpt: '',
      content: '',
      imageUrl: '',
      tags: '',
      readTime: '',
      status: 'Draft',
    };
    this.isHtmlMode = false;
    this.showModal = true;
    setTimeout(() => this.syncToVisualEditor(), 50);
  }

  openEditModal(blog: AdminBlogPost): void {
    this.isEditing = true;
    this.currentBlogId = blog.id;
    this.formData = {
      title: blog.title,
      category: blog.category,
      authorName: blog.authorName,
      excerpt: blog.excerpt,
      content: blog.content,
      imageUrl: blog.imageUrl || '',
      tags: blog.tags || '',
      readTime: blog.readTime || '',
      status: blog.status,
    };
    this.isHtmlMode = false;
    this.showModal = true;
    setTimeout(() => this.syncToVisualEditor(), 50);
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBlogId = null;
  }

  getEstimatedReadTime(): string {
    const words = (this.formData.content || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    this.isUploadingImage = true;
    this.errorMessage = '';
    this.http.post<any>(`${this.apiUrl}/blog/upload-image`, uploadData).subscribe({
      next: (res) => {
        const uploadedUrl = res?.data?.imageUrl || res?.imageUrl || '';
        if (uploadedUrl) {
          this.formData.imageUrl = uploadedUrl;
        } else {
          this.errorMessage = 'Image was uploaded but no URL was returned.';
        }
        this.isUploadingImage = false;
        input.value = '';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to upload blog image.';
        this.isUploadingImage = false;
        input.value = '';
      },
    });
  }

  saveBlog(overrideStatus?: 'Draft' | 'Published'): void {
    if (!this.isHtmlMode) {
      this.syncFromVisualEditor();
    }

    if (!this.formData.title.trim() || !this.formData.content.trim() || !this.formData.excerpt.trim()) {
      this.errorMessage = 'Please provide Title, Summary, and Content.';
      return;
    }

    if (overrideStatus) {
      this.formData.status = overrideStatus;
    }

    this.isSaving = true;
    const payload = {
      ...this.formData,
      readTime: this.formData.readTime.trim() || this.getEstimatedReadTime(),
    };

    if (this.isEditing && this.currentBlogId) {
      this.http.put<any>(`${this.apiUrl}/blog/${this.currentBlogId}`, payload).subscribe({
        next: () => {
          this.successMessage = `Article "${this.formData.title}" updated successfully!`;
          this.isSaving = false;
          this.closeModal();
          this.loadBlogs();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to update article.';
          this.isSaving = false;
        },
      });
    } else {
      this.http.post<any>(`${this.apiUrl}/blog`, payload).subscribe({
        next: () => {
          this.successMessage = `Article "${this.formData.title}" created successfully!`;
          this.isSaving = false;
          this.closeModal();
          this.loadBlogs();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to create article.';
          this.isSaving = false;
        },
      });
    }
  }

  toggleStatus(blog: AdminBlogPost): void {
    const nextStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    this.http.patch<any>(`${this.apiUrl}/blog/${blog.id}/status`, { status: nextStatus }).subscribe({
      next: () => {
        blog.status = nextStatus;
        this.successMessage = `Article "${blog.title}" is now ${nextStatus}!`;
        this.applyFilters();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Could not update blog status.';
      },
    });
  }

  confirmDelete(blog: AdminBlogPost): void {
    this.blogToDelete = blog;
  }

  deleteConfirmed(): void {
    if (!this.blogToDelete) return;

    this.isDeleting = true;
    this.http.delete<any>(`${this.apiUrl}/blog/${this.blogToDelete.id}`).subscribe({
      next: () => {
        this.successMessage = `Article "${this.blogToDelete?.title}" deleted successfully.`;
        this.blogToDelete = null;
        this.isDeleting = false;
        this.loadBlogs();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete blog article.';
        this.isDeleting = false;
      },
    });
  }

  resolveImageUrl(url?: string | null): string {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    const backendOrigin = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
    const cleanPath = trimmed.replace(/\\/g, '/').replace(/^\/+/, '');
    if (cleanPath.startsWith('assets/')) {
      return `/${cleanPath}`;
    }
    const finalPath = cleanPath.startsWith('uploads/') || cleanPath.startsWith('temple_images/')
      ? cleanPath
      : `uploads/${cleanPath}`;
    return `${backendOrigin}/${finalPath}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.onerror = null;
      target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80';
    }
  }
}
