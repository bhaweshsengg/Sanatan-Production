import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

export interface PublicBlogPost {
  id: number | string;
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  readTime?: string;
  tags?: string;
  publishedAt?: string;
  createdAt: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .blog-article-html h2, .blog-article-html ::ng-deep h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .blog-article-html h3, .blog-article-html ::ng-deep h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.35;
    }
    .blog-article-html p, .blog-article-html ::ng-deep p {
      margin-bottom: 1rem;
      line-height: 1.75;
    }
    .blog-article-html ul, .blog-article-html ::ng-deep ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .blog-article-html ol, .blog-article-html ::ng-deep ol {
      list-style-type: decimal;
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .blog-article-html li, .blog-article-html ::ng-deep li {
      margin-bottom: 0.35rem;
    }
    .blog-article-html blockquote, .blog-article-html ::ng-deep blockquote {
      border-left: 4px solid #ea580c;
      background-color: #fff7ed;
      padding: 0.85rem 1.2rem;
      margin: 1.25rem 0;
      border-radius: 0.5rem;
      font-style: italic;
      color: #7c2d12;
    }
    .blog-article-html a, .blog-article-html ::ng-deep a {
      color: #ea580c;
      text-decoration: underline;
      font-weight: 500;
    }
    .blog-article-html hr, .blog-article-html ::ng-deep hr {
      margin: 1.5rem 0;
      border: 0;
      border-top: 1px solid #e5e7eb;
    }
    .blog-article-html img, .blog-article-html ::ng-deep img {
      max-height: 320px;
      width: auto;
      max-width: 100%;
      object-fit: cover;
      border-radius: 0.75rem;
      margin: 1.25rem auto;
      display: block;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-gray-50 font-['Inter']">
      <!-- HERO HEADER -->
      <header class="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white py-14 px-4 sm:px-6 shadow-md">
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div class="max-w-6xl mx-auto relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-3">
            <span>📰</span>
            <span>Sanatan Community Journal</span>
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Sanatan Blog &amp; Articles
          </h1>
          <p class="text-base sm:text-lg text-orange-100 max-w-2xl mx-auto font-light leading-relaxed">
            Spiritual wisdom, Vedic culture, festival stories, philosophy, and community updates from Sanatan New Zealand.
          </p>

          <!-- SEARCH BAR -->
          <div class="mt-8 max-w-xl mx-auto">
            <div class="relative flex items-center shadow-lg rounded-2xl bg-white overflow-hidden border border-orange-200">
              <span class="pl-4 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="filterBlogs()"
                placeholder="Search articles by title, topic, author, or keyword..."
                class="w-full py-3.5 pl-3 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                *ngIf="searchTerm"
                type="button"
                (click)="searchTerm = ''; filterBlogs()"
                class="pr-4 text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- MAIN CONTAINER -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <!-- CATEGORY FILTERS BAR -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div class="flex flex-wrap items-center gap-2">
            <button
              *ngFor="let cat of categories"
              type="button"
              (click)="setCategory(cat)"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              [ngClass]="{
                'bg-orange-600 text-white shadow-sm': selectedCategory === cat,
                'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200': selectedCategory !== cat
              }"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Quick Navigation Links -->
          <div class="flex items-center gap-2">
            <a
              routerLink="/religiouscontents"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium text-xs border border-gray-200 shadow-sm transition"
            >
              <span>📜</span>
              <span>Religious Articles</span>
            </a>
            <a
              routerLink="/festival"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium text-xs border border-gray-200 shadow-sm transition"
            >
              <span>🪔</span>
              <span>Festivals</span>
            </a>
          </div>
        </div>

        <!-- LOADING STATE -->
        <div *ngIf="loading" class="py-20 text-center text-gray-500">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-3"></div>
          <p class="text-sm font-medium">Loading blog articles...</p>
        </div>

        <!-- FEATURED HERO ARTICLE (Top Post) -->
        <div
          *ngIf="!loading && featuredBlog && selectedCategory === 'All' && !searchTerm"
          (click)="openBlogModal(featuredBlog)"
          class="max-w-5xl mx-auto mb-10 group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
        >
          <div class="lg:col-span-5 relative h-64 lg:h-96  overflow-hidden bg-gray-100">
            <img
              *ngIf="featuredBlog.imageUrl"
              [src]="resolveImageUrl(featuredBlog.imageUrl)"
              [alt]="featuredBlog.title"
              (error)="onImageError($event)"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div *ngIf="!featuredBlog.imageUrl" class="w-full h-full flex items-center justify-center text-6xl opacity-30 bg-orange-50">
              📰
            </div>
            <div class="absolute top-4 left-4">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow">
                ⭐ Featured Article
              </span>
            </div>
          </div>
          <div class="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-wider mb-2">
                <span>{{ featuredBlog.category }}</span>
                <span>•</span>
                <span class="text-gray-400 font-normal">{{ featuredBlog.readTime || '5 min read' }}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-3">
                {{ featuredBlog.title }}
              </h2>
              <p class="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-6">
                {{ featuredBlog.excerpt }}
              </p>
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-medium text-gray-700">
                <div class="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  ✍️
                </div>
                <span>{{ featuredBlog.authorName }}</span>
              </div>
              <span class="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article <span>→</span>
              </span>
            </div>
          </div>
        </div>

        <!-- BLOG POSTS GRID -->
        <div *ngIf="!loading && displayBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            *ngFor="let post of displayBlogs"
            (click)="openBlogModal(post)"
            class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <!-- Card Image -->
            <div class="relative h-52 w-full overflow-hidden bg-gradient-to-tr from-orange-100 to-amber-50">
              <img
                *ngIf="post.imageUrl"
                [src]="resolveImageUrl(post.imageUrl)"
                [alt]="post.title"
                (error)="onImageError($event)"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div *ngIf="!post.imageUrl" class="h-full w-full flex items-center justify-center text-5xl opacity-40">
                📰
              </div>
              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-orange-800 shadow-sm backdrop-blur-sm">
                  {{ post.category }}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1">
                    <span>📅</span>
                    <span>{{ post.publishedAt ? (post.publishedAt | date:'mediumDate') : (post.createdAt | date:'mediumDate') }}</span>
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{{ post.readTime || '4 min read' }}</span>
                  </span>
                </div>

                <h3 class="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-snug">
                  {{ post.title }}
                </h3>

                <p class="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {{ post.excerpt }}
                </p>
              </div>

              <!-- Card Footer -->
              <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div class="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px]">
                    ✍️
                  </div>
                  <span class="line-clamp-1">{{ post.authorName }}</span>
                </div>

                <span class="text-xs font-semibold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read More <span>→</span>
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- EMPTY STATE -->
        <div *ngIf="!loading && filteredBlogs.length === 0" class="py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-lg mx-auto">
          <div class="text-5xl mb-3">📜</div>
          <h3 class="text-xl font-bold text-gray-900">No blog posts found</h3>
          <p class="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            No articles matched your search or category filter. Check back soon for new articles published by our editors.
          </p>
          <button
            type="button"
            (click)="resetFilters()"
            class="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition"
          >
            Reset Filters
          </button>
        </div>
      </main>

      <!-- FULL BLOG READER MODAL -->
      <div *ngIf="selectedBlog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col overflow-hidden">
          <!-- Cover Image -->
          <div class="relative h-64 sm:h-72 w-full bg-gray-900 flex-shrink-0 overflow-hidden">
            <img
              *ngIf="selectedBlog.imageUrl"
              [src]="resolveImageUrl(selectedBlog.imageUrl)"
              [alt]="selectedBlog.title"
              (error)="onImageError($event)"
              class="h-full w-full object-cover opacity-85"
            />
            <div *ngIf="!selectedBlog.imageUrl" class="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-700 via-amber-700 to-red-800 text-6xl text-white/30">
              🕉️
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <!-- Close Button -->
            <button
              type="button"
              (click)="selectedBlog = null"
              class="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/80 p-2 text-white transition backdrop-blur-sm cursor-pointer"
              title="Close Reader"
            >
              ✕
            </button>

            <!-- Title Overlay -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white mb-2 shadow">
                {{ selectedBlog.category }}
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
                {{ selectedBlog.title }}
              </h2>
            </div>
          </div>

          <!-- Content Body -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <!-- Author & Metadata Bar -->
            <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                  ✍️
                </div>
                <div>
                  <div class="font-semibold text-gray-900 text-sm">{{ selectedBlog.authorName }}</div>
                  <div class="text-gray-400">Published on {{ selectedBlog.publishedAt ? (selectedBlog.publishedAt | date:'longDate') : (selectedBlog.createdAt | date:'longDate') }}</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-700">
                  ⏱️ {{ selectedBlog.readTime || '4 min read' }}
                </span>
                <button
                  type="button"
                  (click)="copyArticleLink()"
                  class="rounded-lg border border-gray-300 hover:bg-gray-50 px-3 py-1.5 font-medium text-gray-700 transition cursor-pointer"
                >
                  {{ isLinkCopied ? 'Link Copied! ✓' : 'Share Article 🔗' }}
                </button>
              </div>
            </div>

            <!-- Excerpt Callout -->
            <div class="rounded-xl bg-orange-50/80 border-l-4 border-orange-500 p-4 text-sm font-medium text-orange-950 italic">
              "{{ selectedBlog.excerpt }}"
            </div>

            <!-- Full Article Body -->
            <div
              *ngIf="isHtmlContent(selectedBlog.content); else plainTextBody"
              class="blog-article-html text-base text-gray-800 leading-relaxed"
              [innerHTML]="getSanitizedHtml(selectedBlog.content)"
            ></div>
            <ng-template #plainTextBody>
              <div class="text-base text-gray-800 leading-relaxed space-y-4 font-normal">
                <p *ngFor="let paragraph of getFormattedParagraphs(selectedBlog.content)">
                  {{ paragraph }}
                </p>
              </div>
            </ng-template>

            <!-- Tags -->
            <div *ngIf="selectedBlog.tags" class="pt-4 border-t border-gray-100">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Topic Tags</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  *ngFor="let tag of getTagsList(selectedBlog.tags)"
                  class="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 font-medium text-xs border border-orange-200/60"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
            <span class="text-xs text-gray-500 font-medium">Sanatan New Zealand Community</span>
            <button
              type="button"
              (click)="selectedBlog = null"
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BlogComponent implements OnInit {
  apiUrl = environment.apiBaseUrl;
  blogs: PublicBlogPost[] = [];
  filteredBlogs: PublicBlogPost[] = [];
  displayBlogs: PublicBlogPost[] = [];
  featuredBlog: PublicBlogPost | null = null;
  loading = true;

  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = [
    'All',
    'Festivals',
    'Vedic Philosophy',
    'Temples & Heritage',
    'Rituals & Practices',
    'Community',
    'General Sanatan'
  ];

  selectedBlog: PublicBlogPost | null = null;
  isLinkCopied = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/public/blog?limit=all`).subscribe({
      next: (res) => {
        this.blogs = res.data || [];
        this.filterBlogs();
        this.loading = false;
      },
      error: () => {
        // Fallback to /blog
        this.http.get<any>(`${this.apiUrl}/blog?limit=all`).subscribe({
          next: (res) => {
            this.blogs = res.data || [];
            this.filterBlogs();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterBlogs();
  }

  filterBlogs(): void {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategory;

    this.filteredBlogs = this.blogs.filter((blog) => {
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.content.toLowerCase().includes(q) ||
        blog.authorName.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.toLowerCase().includes(q));

      const matchesCat = cat === 'All' || blog.category.toLowerCase() === cat.toLowerCase();

      return matchesSearch && matchesCat;
    });

    if (this.selectedCategory === 'All' && !this.searchTerm && this.filteredBlogs.length > 0) {
      this.featuredBlog = this.filteredBlogs[0];
      this.displayBlogs = this.filteredBlogs.slice(1);
    } else {
      this.featuredBlog = null;
      this.displayBlogs = this.filteredBlogs;
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.filterBlogs();
  }

  openBlogModal(blog: PublicBlogPost): void {
    this.selectedBlog = blog;
    this.isLinkCopied = false;
  }

  getFormattedParagraphs(content: string): string[] {
    if (!content) return [];
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  isHtmlContent(content?: string): boolean {
    if (!content) return false;
    return /<[a-z][\s\S]*>/i.test(content);
  }

  getSanitizedHtml(content?: string): SafeHtml {
    if (!content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getTagsList(tags?: string | null): string[] {
    if (!tags) return [];
    return tags
      .split(/[,#\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  copyArticleLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.isLinkCopied = true;
      setTimeout(() => (this.isLinkCopied = false), 2500);
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
      target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80';
    }
  }
}
