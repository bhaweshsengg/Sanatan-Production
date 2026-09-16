import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface PublicBlogPost {
  id: number;
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string | null;
  authorName: string;
  tags?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  author?: { username: string };
}

export interface ReligiousContentItem {
  id: string;
  title: string;
  sanskritTitle: string;
  category: 'Mantras' | 'Chalisas' | 'Stotrams' | 'Scriptures';
  deity: string;
  source: string;
  summary: string;
  sanskritText: string;
  transliteration: string;
  englishMeaning: string;
  significance: string;
  bestTimeToChant?: string;
  verses?: Array<{ sanskrit: string; transliteration: string; english: string }>;
}

@Component({
  selector: 'app-religious-contents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Sacred Header Banner -->
      <header class="bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 py-16 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-full mb-4 shadow-inner text-2xl">
            🕉️
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Sanatan Blog &amp; Spiritual Wisdom</h1>
          <p class="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto font-light">
            In-depth spiritual articles, philosophical insights, Vedic scriptures, and devotional treasures of Sanatan Dharma
          </p>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
            <div class="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search articles, philosophy, scriptures, deities, or keywords..."
                class="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm"
                [(ngModel)]="searchTerm"
                (input)="filterContents()"
              />
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
              </svg>
            </div>
            <div class="relative w-full sm:w-auto min-w-[200px]">
              <select
                class="block w-full px-4 py-3 rounded-lg bg-white border border-transparent text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm font-medium cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="filterContents()"
              >
                <option value="All">All Categories</option>
                <!-- Blog Categories -->
                <option value="Philosophy">Philosophy</option>
                <option value="Scriptures">Sacred Scriptures</option>
                <option value="Vedic Wisdom">Vedic Wisdom</option>
                <option value="Traditions & Rituals">Traditions &amp; Rituals</option>
                <option value="Festival Insights">Festival Insights</option>
                <option value="Mantras & Meditation">Mantras &amp; Meditation</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Navigation Tabs & Container -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- View Mode Tabs -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-8">
            <div class="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-inner">
              <button
                type="button"
                (click)="activeTab = 'blogs'"
                class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                [ngClass]="activeTab === 'blogs' ? 'bg-white text-orange-700 shadow-md transform scale-[1.02]' : 'text-gray-600 hover:text-gray-900'"
              >
                <span>📰</span>
                <span>Articles &amp; Blog Posts ({{ filteredBlogs.length }})</span>
              </button>

              <button
                type="button"
                (click)="activeTab = 'devotional'"
                class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                [ngClass]="activeTab === 'devotional' ? 'bg-white text-orange-700 shadow-md transform scale-[1.02]' : 'text-gray-600 hover:text-gray-900'"
              >
                <span>📿</span>
                <span>Sacred Devotional Wisdom ({{ filteredDevotionalItems.length }})</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <a
                routerLink="/festival"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs border border-gray-300 shadow-sm transition"
              >
                <span>🪔</span>
                <span>Festivals</span>
              </a>
              <a
                routerLink="/panchang"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <span>📅</span>
                <span>Live Panchang</span>
              </a>
            </div>
          </div>

          <!-- TAB 1: ARTICLES & BLOG POSTS -->
          <section *ngIf="activeTab === 'blogs'">
            <!-- Loading State -->
            <div *ngIf="loadingBlogs" class="py-20 text-center text-gray-500">
              <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-3"></div>
              <p class="text-sm font-medium">Loading sacred blog posts...</p>
            </div>

            <!-- Blog Posts Grid -->
            <div *ngIf="!loadingBlogs && filteredBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article
                *ngFor="let post of filteredBlogs"
                (click)="openBlogModal(post)"
                class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <!-- Featured Image -->
                <div class="relative h-52 w-full overflow-hidden bg-gradient-to-tr from-orange-100 to-amber-50">
                  <img
                    *ngIf="post.imageUrl"
                    [src]="resolveImageUrl(post.imageUrl)"
                    [alt]="post.title"
                    (error)="onImageError($event)"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div *ngIf="!post.imageUrl" class="h-full w-full flex items-center justify-center text-5xl opacity-40">
                    🪔
                  </div>
                  <!-- Category Badge -->
                  <div class="absolute top-3 left-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-orange-800 shadow-sm backdrop-blur-sm">
                      {{ post.category }}
                    </span>
                  </div>
                </div>

                <!-- Card Content -->
                <div class="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <!-- Meta Info -->
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

                    <!-- Title -->
                    <h2 class="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-snug">
                      {{ post.title }}
                    </h2>

                    <!-- Excerpt -->
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

            <!-- Empty State for Blogs -->
            <div *ngIf="!loadingBlogs && filteredBlogs.length === 0" class="py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div class="text-4xl mb-3">📜</div>
              <h3 class="text-lg font-bold text-gray-900">No blog posts found</h3>
              <p class="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                No articles matched your search or category filter. Try clearing filters to view all available spiritual articles.
              </p>
              <button
                type="button"
                (click)="resetFilters()"
                class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition"
              >
                Reset Filters
              </button>
            </div>
          </section>

          <!-- TAB 2: SACRED DEVOTIONAL WISDOM (Preserved Mantras, Chalisas, Stotrams) -->
          <section *ngIf="activeTab === 'devotional'">
            <div *ngIf="filteredDevotionalItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let item of filteredDevotionalItems"
                class="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div class="p-6">
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      [ngClass]="{
                        'bg-orange-100 text-orange-800': item.category === 'Mantras',
                        'bg-amber-100 text-amber-800': item.category === 'Chalisas',
                        'bg-red-100 text-red-800': item.category === 'Stotrams',
                        'bg-emerald-100 text-emerald-800': item.category === 'Scriptures'
                      }"
                    >
                      {{ item.category }}
                    </span>
                    <span class="text-xs text-gray-400 font-medium">{{ item.deity }}</span>
                  </div>

                  <h3 class="text-lg font-bold text-gray-900 mb-1">{{ item.title }}</h3>
                  <div class="text-sm font-serif text-orange-700 mb-3 font-semibold">{{ item.sanskritTitle }}</div>
                  <p class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{{ item.summary }}</p>

                  <div class="bg-orange-50/70 p-3 rounded-xl border border-orange-100 mb-4 font-serif text-center text-sm text-orange-900 leading-relaxed">
                    {{ item.sanskritText }}
                  </div>

                  <p class="text-xs text-gray-600 italic line-clamp-2 leading-relaxed">
                    "{{ item.englishMeaning }}"
                  </p>
                </div>

                <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    (click)="copySanskrit(item)"
                    class="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 font-medium transition"
                  >
                    <span>📋</span>
                    <span>{{ copiedId === item.id ? 'Copied Sanskrit!' : 'Copy Sanskrit' }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="openDevotionalModal(item)"
                    class="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
                  >
                    <span>Read Prayer</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- MODAL: FULL BLOG POST READER -->
      <div *ngIf="selectedBlog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col overflow-hidden">
          <!-- Modal Header / Cover Image -->
          <div class="relative h-64 sm:h-72 w-full bg-gray-900 flex-shrink-0">
            <img
              *ngIf="selectedBlog.imageUrl"
              [src]="resolveImageUrl(selectedBlog.imageUrl)"
              [alt]="selectedBlog.title"
              (error)="onImageError($event)"
              class="h-full w-full object-cover opacity-85"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <!-- Close Button -->
            <button
              type="button"
              (click)="selectedBlog = null"
              class="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/80 p-2 text-white transition backdrop-blur-sm"
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

          <!-- Modal Body (Scrollable Reading Area) -->
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
                  class="rounded-lg border border-gray-300 hover:bg-gray-50 px-3 py-1.5 font-medium text-gray-700 transition"
                >
                  {{ isLinkCopied ? 'Link Copied! ✓' : 'Share Article 🔗' }}
                </button>
              </div>
            </div>

            <!-- Excerpt Callout -->
            <div class="rounded-xl bg-orange-50/80 border-l-4 border-orange-500 p-4 text-sm font-medium text-orange-950 italic">
              "{{ selectedBlog.excerpt }}"
            </div>

            <!-- Multi-Paragraph Formatted Article Content -->
            <div class="space-y-4 text-base text-gray-700 font-serif leading-relaxed">
              <p *ngFor="let paragraph of getFormattedParagraphs(selectedBlog.content)">
                {{ paragraph }}
              </p>
            </div>

            <!-- Tags -->
            <div *ngIf="selectedBlog.tags" class="pt-4 border-t border-gray-100">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Topic Tags</div>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let tag of getTagsList(selectedBlog.tags)" class="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-sans">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span class="text-xs text-gray-400 font-sans">Sanatan New Zealand Community Portal</span>
            <button
              type="button"
              (click)="selectedBlog = null"
              class="rounded-lg bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 text-xs font-semibold transition font-sans"
            >
              Back to Articles
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL: DEVOTIONAL TEXT READER -->
      <div *ngIf="selectedDevotionalItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-orange-600">{{ selectedDevotionalItem.category }}</span>
              <h3 class="text-xl font-bold text-gray-900 mt-0.5">{{ selectedDevotionalItem.title }}</h3>
              <div class="text-sm font-serif text-orange-700 font-semibold">{{ selectedDevotionalItem.sanskritTitle }}</div>
            </div>
            <button (click)="selectedDevotionalItem = null" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
            <div class="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center font-serif text-base text-orange-950 whitespace-pre-line leading-relaxed">
              {{ selectedDevotionalItem.sanskritText }}
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-1">Transliteration</h4>
              <p class="text-xs text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                {{ selectedDevotionalItem.transliteration }}
              </p>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-1">English Meaning</h4>
              <p class="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                {{ selectedDevotionalItem.englishMeaning }}
              </p>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-1">Spiritual Significance</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                {{ selectedDevotionalItem.significance }}
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-end">
            <button
              (click)="selectedDevotionalItem = null"
              class="rounded-lg bg-orange-600 text-white px-4 py-2 text-xs font-semibold hover:bg-orange-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReligiousContentsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  activeTab: 'blogs' | 'devotional' = 'blogs';

  blogs: PublicBlogPost[] = [];
  filteredBlogs: PublicBlogPost[] = [];
  loadingBlogs = true;

  searchTerm = '';
  selectedCategory = 'All';

  selectedBlog: PublicBlogPost | null = null;
  selectedDevotionalItem: ReligiousContentItem | null = null;

  copiedId: string | null = null;
  isLinkCopied = false;

  // Preserved authentic Sanatan Devotional Wisdom
  devotionalItems: ReligiousContentItem[] = [
    {
      id: 'gayatri-mantra',
      title: 'Gayatri Mantra',
      sanskritTitle: 'गायत्री मन्त्र',
      category: 'Mantras',
      deity: 'Savitr (The Divine Sun)',
      source: 'Rigveda (Mandala 3.62.10)',
      summary: 'The supreme Vedic illumination mantra for intellectual wisdom and divine inner light.',
      sanskritText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
      transliteration: 'Oṃ bhūr bhuvaḥ svaḥ tat-savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||',
      englishMeaning: 'We meditate upon that supreme radiant glory of the divine Sun, the illuminator of all realms. May that sacred light awaken and inspire our intellect.',
      significance: 'Chanted at dawn (Brahma Muhurta) to dissolve darkness, purify the intellect, and attune consciousness with universal truth.',
      bestTimeToChant: 'Sunrise (Pratah Sandhya), Midday (Madhyanha), and Sunset (Sayam Sandhya).',
    },
    {
      id: 'maha-mrityunjaya',
      title: 'Maha Mrityunjaya Mantra',
      sanskritTitle: 'महामृत्युंजय मन्त्र',
      category: 'Mantras',
      deity: 'Lord Shiva (Tryambaka)',
      source: 'Rigveda (Mandala 7.59.12)',
      summary: 'The great death-conquering and healing mantra for liberation from fear, illness, and mortality.',
      sanskritText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
      transliteration: 'Oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam | urvārukam-iva bandhanān mṛtyor mukṣīya māmṛtāt ||',
      englishMeaning: 'We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe melon is effortlessly liberated from its vine, may we be liberated from the bondage of mortality unto immortality.',
      significance: 'Conferred by Sage Markandeya to overcome chronic suffering, fear of mortality, and spiritual bondage.',
      bestTimeToChant: 'Early morning or during healing prayers (108 times).',
    },
    {
      id: 'hanuman-chalisa',
      title: 'Shri Hanuman Chalisa',
      sanskritTitle: 'श्री हनुमान चालीसा',
      category: 'Chalisas',
      deity: 'Lord Hanuman',
      source: 'Goswami Tulsidas (Awadhi/Sanskrit)',
      summary: 'The legendary 40-verse hymn invoking bravery, unwavering devotion, and protection against obstacles.',
      sanskritText: 'जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥\nराम दूत अतुलित बल धामा । अंजनि पुत्र पवनसुत नामा ॥',
      transliteration: 'Jaya Hanumāna jñāna guna sāgara | Jaya kapīsa tihu loka ujāgara || Rāma dūta atulita bala dhāmā | Añjani-putra pavanasuta nāmā ||',
      englishMeaning: 'Victory to Hanuman, ocean of wisdom and virtues! Victory to the lord of the Vanaras, renowned across all three worlds. You are the messenger of Lord Rama, the abode of incomparable strength, born of Anjana and hailed as the son of the Wind.',
      significance: 'Recited millions of times across the globe on Tuesdays and Saturdays for courage, mental clarity, and overcoming negative influences.',
      bestTimeToChant: 'Tuesdays and Saturdays, mornings and evenings.',
    },
    {
      id: 'shiva-tandava',
      title: 'Shiva Tandava Stotram',
      sanskritTitle: 'शिवताण्डवस्तोत्रम्',
      category: 'Stotrams',
      deity: 'Lord Shiva',
      source: 'King Ravana (Sanskrit Metre: Panchachamara)',
      summary: 'A breathtakingly rhythmic hymn capturing the cosmic dance of creation and dissolution.',
      sanskritText: 'जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥',
      transliteration: 'Jaṭā-ṭavī-gala-jjala-pravāha-pāvita-sthale | gale avalambya lambitāṃ bhujaṅga-tuṅga-mālikām | ḍamad-ḍamad-ḍamad-ḍaman-nināda-vad-ḍamarvayaṃ | cakāra caṇḍa-tāṇḍavaṃ tanotu naḥ śivaḥ śivam || 1 ||',
      englishMeaning: 'From the forest of His matted locks, where the pure Ganges flows, with the great serpent adorned around His neck, to the reverberating sound of the damaru drum, Lord Shiva performs His cosmic Tandava dance. May He bless us with eternal auspiciousness.',
      significance: 'Energizes the nervous system and dissolves deep-seated ego through dynamic sound vibrations.',
      bestTimeToChant: 'Pradosha and Mondays during evening twilight.',
    },
    {
      id: 'bhagavad-gita-core',
      title: 'Shrimad Bhagavad Gita Guide',
      sanskritTitle: 'श्रीमद्भगवद्गीता',
      category: 'Scriptures',
      deity: 'Lord Krishna',
      source: 'Mahabharata (Bhishma Parva)',
      summary: 'The eternal guide to Karma Yoga, Bhakti Yoga, and Jnana Yoga in daily modern life.',
      sanskritText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥',
      transliteration: 'Karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi || 2.47 ||',
      englishMeaning: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of results, nor let your mind be attached to inaction.',
      significance: 'The cornerstone of righteous, stress-free action in professional, personal, and spiritual pursuits.',
      bestTimeToChant: 'Daily study and contemplation before undertaking duties.',
    },
    {
      id: 'durga-stuti',
      title: 'Ya Devi Sarvabhuteshu (Durga Stuti)',
      sanskritTitle: 'या देवी सर्वभूतेषु',
      category: 'Stotrams',
      deity: 'Maa Durga (Divine Mother)',
      source: 'Markandeya Purana (Devi Mahatmyam / Chandi Path)',
      summary: 'The supreme invocation to the Divine Mother present in all beings as consciousness, power, and compassion.',
      sanskritText: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता ।\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥',
      transliteration: 'Yā devī sarva-bhūteṣu śakti-rūpeṇa saṃsthitā | namas tasyai namas tasyai namas tasyai namo namaḥ ||',
      englishMeaning: 'To that Divine Goddess who abides in all living beings as the manifestation of primal Energy and Power: Salutations unto Her, salutations unto Her, salutations again and again.',
      significance: 'Chanted especially during Navratri and Fridays for maternal protection, inner strength, and universal harmony.',
      bestTimeToChant: 'Fridays and during Navratri celebrations.',
    }
  ];

  filteredDevotionalItems: ReligiousContentItem[] = [];

  ngOnInit(): void {
    this.filteredDevotionalItems = [...this.devotionalItems];
    this.loadPublicBlogs();
  }

  loadPublicBlogs(): void {
    this.loadingBlogs = true;
    this.http.get<any>(`${this.apiUrl}/public/blog?limit=all`).subscribe({
      next: (res) => {
        this.blogs = res.data || [];
        this.filterContents();
        this.loadingBlogs = false;
      },
      error: () => {
        // Fallback to /blog
        this.http.get<any>(`${this.apiUrl}/blog?limit=all`).subscribe({
          next: (res) => {
            this.blogs = res.data || [];
            this.filterContents();
            this.loadingBlogs = false;
          },
          error: () => {
            this.loadingBlogs = false;
          }
        });
      }
    });
  }

  filterContents(): void {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategory;

    // Filter Blogs
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

    // Filter Devotional Items
    this.filteredDevotionalItems = this.devotionalItems.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.sanskritTitle.toLowerCase().includes(q) ||
        item.deity.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.englishMeaning.toLowerCase().includes(q);

      const matchesCat = cat === 'All' || item.category.toLowerCase() === cat.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.filterContents();
  }

  openBlogModal(blog: PublicBlogPost): void {
    this.selectedBlog = blog;
    this.isLinkCopied = false;
  }

  openDevotionalModal(item: ReligiousContentItem): void {
    this.selectedDevotionalItem = item;
  }

  getFormattedParagraphs(content: string): string[] {
    if (!content) return [];
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  getTagsList(tags?: string | null): string[] {
    if (!tags) return [];
    return tags
      .split(/[,#\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  copySanskrit(item: ReligiousContentItem): void {
    navigator.clipboard.writeText(item.sanskritText).then(() => {
      this.copiedId = item.id;
      setTimeout(() => (this.copiedId = null), 2500);
    });
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
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const backendOrigin = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${backendOrigin}${cleanPath}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80';
    }
  }
}
