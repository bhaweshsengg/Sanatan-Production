import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/common.service';

export interface FestivalItem {
  id: number | string;
  name: string;
  date: string;
  rawDate?: string;
  time?: string;
  significance: string;
  rituals: string[];
  deities: string[];
  category: string;
  location?: string;
  templeName?: string;
  address?: string;
  imageUrl?: string | null;
  imageFailed?: boolean;
  mapsLink?: string | null;
  onlineLink?: string | null;
  attendees?: number;
  isCommunityEvent?: boolean;
  isUpcoming?: boolean;
}

@Component({
  selector: 'app-festival',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Gradient Header -->
      <header class="bg-gradient-to-r from-orange-600 to-red-700 py-16 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-full mb-4 shadow-inner text-2xl">
            🪔
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Sanatan Festivals in New Zealand</h1>
          <p class="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto font-light">
            Explore the sacred calendar of Sanatan festivals and community celebrations organized across Aotearoa
          </p>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
            <div class="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search festivals by name, deity, or location..."
                class="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm"
                [(ngModel)]="searchTerm"
                (input)="filterFestivals()"
              />
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
              </svg>
            </div>
            <div class="relative w-full sm:w-auto min-w-[220px]">
              <select
                class="block w-full px-4 py-3 rounded-lg bg-white border border-transparent text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm font-medium cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="filterFestivals()"
              >
                <option value="All">All Categories</option>
                <option value="Festival">Community Festivals</option>
                <option value="Major Festival">Major Festivals</option>
                <option value="Religious Observance">Religious Observances</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Status / Results Summary -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ filteredFestivals.length }} {{ filteredFestivals.length === 1 ? 'Festival' : 'Festivals' }} Found
              </h2>
              <p class="text-sm text-gray-500 mt-0.5" *ngIf="!isLoading">
                Showing festival celebrations and observances created across our community
              </p>
            </div>
            <div class="flex items-center gap-2">
              <a
                routerLink="/events/add-event"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <span>➕</span>
                <span>Submit Festival Event</span>
              </a>
              <a
                routerLink="/events"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium text-xs border border-gray-300 transition shadow-sm"
              >
                <span>📅</span>
                <span>All Events</span>
              </a>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="py-20 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p class="text-gray-600 font-medium">Loading Sanatan festivals across New Zealand...</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage && !isLoading" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>
            <button (click)="loadFestivals()" class="underline font-semibold text-xs hover:text-red-900">Retry</button>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && filteredFestivals.length === 0" class="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-xl mx-auto">
            <div class="text-5xl mb-4">🪔</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ festivals.length === 0 ? 'No Festivals Listed Yet' : 'No Matching Festivals' }}
            </h3>
            <p class="text-gray-500 mb-6 text-sm">
              {{ festivals.length === 0 
                ? 'There are currently no festival events listed. You can submit a festival celebration through the Events section to have it displayed here.' 
                : 'We could not find any festivals matching your search or category filter. Try clearing your search filters.' }}
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button
                *ngIf="searchTerm || selectedCategory !== 'All'"
                (click)="resetFilters()"
                class="px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition"
              >
                Reset Filters
              </button>
              <a
                routerLink="/events/add-event"
                class="px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition shadow-sm inline-flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>Submit Festival Event</span>
              </a>
              <a
                routerLink="/events"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
              >
                Browse All Events
              </a>
            </div>
          </div>

          <!-- Festival Cards Grid -->
          <div *ngIf="!isLoading && filteredFestivals.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              *ngFor="let festival of filteredFestivals"
              class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <!-- Festival Image / Banner -->
                <div class="relative w-full aspect-[16/10] bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 overflow-hidden">
                  <img
                    *ngIf="festival.imageUrl && !festival.imageFailed"
                    [src]="resolveImageUrl(festival.imageUrl)"
                    [alt]="festival.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    (error)="onImageError(festival)"
                  />
                  <!-- Fallback Decorative Icon -->
                  <div
                    *ngIf="!festival.imageUrl || festival.imageFailed"
                    class="w-full h-full flex flex-col items-center justify-center text-orange-400 p-4"
                  >
                    <span class="text-5xl mb-1 filter drop-shadow">🪔</span>
                    <span class="text-xs font-semibold text-orange-700 tracking-wider uppercase">Sanatan Festival</span>
                  </div>

                  <!-- Category Badge -->
                  <span class="absolute top-3 right-3 bg-orange-600/95 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {{ festival.category }}
                  </span>

                  <!-- Upcoming Badge -->
                  <span
                    *ngIf="festival.isUpcoming"
                    class="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
                  >
                    <span>✨</span>
                    <span>Upcoming</span>
                  </span>
                </div>

                <!-- Card Body -->
                <div class="p-6">
                  <!-- Title -->
                  <h3 class="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {{ festival.name }}
                  </h3>

                  <!-- Date & Time -->
                  <div class="space-y-1.5 mb-4 text-sm text-gray-600">
                    <div class="flex items-center gap-2 font-medium text-orange-700">
                      <span>📅</span>
                      <span>{{ festival.date }}</span>
                    </div>
                    <div *ngIf="festival.time" class="flex items-center gap-2 text-xs text-gray-500">
                      <span>🕐</span>
                      <span>{{ festival.time }}</span>
                    </div>
                    <div *ngIf="festival.location" class="flex items-center gap-2 text-xs text-gray-600 line-clamp-1">
                      <span>📍</span>
                      <span class="font-medium">{{ festival.location }}</span>
                    </div>
                  </div>

                  <hr class="border-gray-100 my-4" />

                  <!-- Significance / Description -->
                  <div class="mb-4" *ngIf="festival.significance">
                    <h4 class="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1">Significance &amp; Details:</h4>
                    <p class="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {{ festival.significance }}
                    </p>
                  </div>

                  <!-- Key Rituals (if any) -->
                  <div *ngIf="festival.rituals && festival.rituals.length > 0" class="mb-4">
                    <h4 class="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1.5">Key Rituals:</h4>
                    <ul class="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li *ngFor="let ritual of festival.rituals.slice(0, 3)" class="line-clamp-1">
                        {{ ritual }}
                      </li>
                    </ul>
                  </div>

                  <!-- Associated Deities / Temple info -->
                  <div *ngIf="festival.deities && festival.deities.length > 0" class="mb-2">
                    <h4 class="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1.5">Associated Deities:</h4>
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        *ngFor="let deity of festival.deities"
                        class="bg-orange-50 text-orange-800 border border-orange-200/60 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ deity }}
                      </span>
                    </div>
                  </div>

                  <!-- Attendees / Temple footer -->
                  <div *ngIf="(festival.attendees !== undefined && festival.attendees > 0) || festival.templeName" class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span *ngIf="festival.attendees !== undefined && festival.attendees > 0" class="inline-flex items-center gap-1 font-medium text-gray-700">
                      <span>👥</span>
                      <span>{{ festival.attendees }} {{ festival.attendees === 1 ? 'devotee' : 'devotees' }} joined</span>
                    </span>
                    <span *ngIf="!festival.attendees" class="text-gray-400 text-[11px]">
                      Sanatan Community
                    </span>
                    <span *ngIf="festival.templeName" class="text-orange-600 font-medium truncate max-w-[160px]" [title]="festival.templeName">
                      {{ festival.templeName }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Action Buttons -->
              <div class="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-4">
                <button
                  type="button"
                  (click)="openFestivalModal(festival)"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-3 rounded-lg transition shadow-sm"
                >
                  <span>📖</span>
                  <span>Learn More</span>
                </button>
                <a
                  routerLink="/events"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs py-2.5 px-3 rounded-lg transition"
                >
                  <span>📅</span>
                  <span>Find Events</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Details Modal Dialog -->
      <div
        *ngIf="selectedFestival"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        (click)="closeModal()"
      >
        <div
          class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 relative max-h-[90vh] flex flex-col"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header Image -->
          <div class="relative w-full h-52 bg-gradient-to-r from-orange-600 to-red-600 flex-shrink-0">
            <img
              *ngIf="selectedFestival.imageUrl && !selectedFestival.imageFailed"
              [src]="resolveImageUrl(selectedFestival.imageUrl)"
              [alt]="selectedFestival.name"
              class="w-full h-full object-cover"
              (error)="onImageError(selectedFestival)"
            />
            <div
              *ngIf="!selectedFestival.imageUrl || selectedFestival.imageFailed"
              class="w-full h-full flex flex-col items-center justify-center text-white"
            >
              <span class="text-6xl mb-2">🪔</span>
              <span class="text-sm font-semibold tracking-wider uppercase">Sanatan Festival</span>
            </div>
            <!-- Close Button -->
            <button
              type="button"
              (click)="closeModal()"
              class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition focus:outline-none"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <!-- Category Tag -->
            <span class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {{ selectedFestival.category }}
            </span>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedFestival.name }}</h3>
              <p class="text-sm font-medium text-orange-600 mt-1 flex items-center gap-1.5">
                <span>📅</span>
                <span>{{ selectedFestival.date }}</span>
                <span *ngIf="selectedFestival.time">· 🕐 {{ selectedFestival.time }}</span>
              </p>
            </div>

            <!-- Location / Venue Details -->
            <div *ngIf="selectedFestival.location || selectedFestival.address" class="bg-orange-50/70 border border-orange-100 rounded-xl p-4 text-sm text-gray-700">
              <div class="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                <span>📍</span>
                <span>Venue &amp; Location:</span>
              </div>
              <p *ngIf="selectedFestival.location" class="font-medium text-orange-950">{{ selectedFestival.location }}</p>
              <p *ngIf="selectedFestival.address" class="text-xs text-gray-600 mt-0.5">{{ selectedFestival.address }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <a
                  *ngIf="selectedFestival.mapsLink"
                  [href]="selectedFestival.mapsLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs font-medium hover:bg-orange-700 transition shadow-sm"
                >
                  <span>🗺️</span>
                  <span>Open in Google Maps</span>
                </a>
                <a
                  *ngIf="selectedFestival.onlineLink"
                  [href]="selectedFestival.onlineLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  <span>🌐</span>
                  <span>Online Link</span>
                </a>
              </div>
            </div>

            <!-- Significance / Detailed Description -->
            <div>
              <h4 class="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2">Significance:</h4>
              <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {{ selectedFestival.significance }}
              </p>
            </div>

            <!-- Rituals -->
            <div *ngIf="selectedFestival.rituals && selectedFestival.rituals.length > 0">
              <h4 class="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2">Sacred Rituals &amp; Practices:</h4>
              <ul class="text-sm text-gray-700 space-y-1.5 ml-4 list-disc">
                <li *ngFor="let ritual of selectedFestival.rituals">{{ ritual }}</li>
              </ul>
            </div>

            <!-- Associated Deities -->
            <div *ngIf="selectedFestival.deities && selectedFestival.deities.length > 0">
              <h4 class="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2">Associated Deities:</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let deity of selectedFestival.deities"
                  class="bg-orange-100 text-orange-900 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ deity }}
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div class="text-xs text-gray-500" *ngIf="selectedFestival.attendees !== undefined && selectedFestival.attendees > 0">
              👥 <strong>{{ selectedFestival.attendees }}</strong> devotees participating
            </div>
            <div class="flex items-center gap-2 ml-auto">
              <a
                routerLink="/events"
                (click)="closeModal()"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition shadow-sm inline-flex items-center gap-1"
              >
                <span>📅</span>
                <span>Join &amp; View in Events</span>
              </a>
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FestivalComponent implements OnInit {
  festivals: FestivalItem[] = [];
  filteredFestivals: FestivalItem[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedFestival: FestivalItem | null = null;

  constructor(
    private readonly commonService: CommonService,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadFestivals();
  }

  loadFestivals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commonService.getFestivalEvents().subscribe({
      next: (events) => {
        const approvedEvents = Array.isArray(events) ? events : [];
        this.festivals = approvedEvents.map((ev: any) => this.mapEventToFestival(ev));
        this.filterFestivals();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching festival events:', err);
        this.errorMessage = 'Could not load festival events. Please check your connection and try again.';
        this.festivals = [];
        this.filteredFestivals = [];
        this.isLoading = false;
      },
    });
  }

  mapEventToFestival(event: any): FestivalItem {
    return {
      id: event.id,
      name: event.title,
      date: this.formatEventDate(event),
      rawDate: event.eventDate,
      time: event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime || '',
      significance: event.description,
      rituals: this.extractRituals(event),
      deities: this.extractDeities(event),
      category: event.category || 'Festival',
      location: event.hallName ? `${event.templeName} - ${event.hallName}` : (event.templeName || event.address || 'New Zealand'),
      templeName: event.templeName,
      address: event.address || event.temple?.full_address || '',
      imageUrl: event.imageUrl,
      mapsLink: event.mapsLink,
      onlineLink: event.onlineLink,
      attendees: event.attendees ?? 0,
      isCommunityEvent: true,
      isUpcoming: this.checkIsUpcoming(event.eventDate),
    };
  }

  resolveImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const clean = url.replace(/\\/g, '/').replace(/^\/+/, '');
    const backendOrigin = environment.apiBaseUrl.replace(/\/api(\/v\d+)?(\/public)?\/?$/, '');
    return `${backendOrigin}/${clean}`;
  }

  onImageError(festival: FestivalItem): void {
    festival.imageFailed = true;
  }

  openFestivalModal(festival: FestivalItem): void {
    this.selectedFestival = festival;
  }

  closeModal(): void {
    this.selectedFestival = null;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.filterFestivals();
  }

  filterFestivals(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const cat = this.selectedCategory;

    this.filteredFestivals = this.festivals.filter((festival) => {
      // Category match
      let categoryMatch = false;
      if (cat === 'All') {
        categoryMatch = true;
      } else if (cat === 'Festival') {
        categoryMatch = festival.category.toLowerCase().includes('festival') || festival.category === 'Festival';
      } else if (cat === 'Major Festival') {
        categoryMatch = festival.category.toLowerCase().includes('major') || festival.category === 'Major Festival';
      } else if (cat === 'Religious Observance') {
        categoryMatch = festival.category.toLowerCase().includes('observance') || festival.category === 'Religious Observance';
      } else {
        categoryMatch = festival.category.toLowerCase() === cat.toLowerCase();
      }

      // Search match (name, significance, location, deities)
      const searchMatch =
        !term ||
        festival.name.toLowerCase().includes(term) ||
        (festival.significance && festival.significance.toLowerCase().includes(term)) ||
        (festival.location && festival.location.toLowerCase().includes(term)) ||
        (festival.templeName && festival.templeName.toLowerCase().includes(term)) ||
        festival.deities.some((d) => d.toLowerCase().includes(term));

      return categoryMatch && searchMatch;
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterFestivals();
  }

  private formatEventDate(event: any): string {
    if (!event.eventDate) return 'Date TBA';
    try {
      const parts = String(event.eventDate).split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const formatted = d.toLocaleDateString('en-NZ', options);

        if (event.multiDay && event.endDate) {
          const endParts = String(event.endDate).split('-');
          if (endParts.length === 3) {
            const endD = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, parseInt(endParts[2], 10));
            return `${formatted} - ${endD.toLocaleDateString('en-NZ', options)}`;
          }
        }
        return formatted;
      }
    } catch {}
    return event.eventDate;
  }

  private checkIsUpcoming(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    try {
      const d = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    } catch {
      return false;
    }
  }

  private extractRituals(event: any): string[] {
    const desc = event.description || '';
    const rituals: string[] = [];
    if (/aarti/i.test(desc)) rituals.push('Maha Aarti & Deepotsav');
    if (/puja|pooja/i.test(desc)) rituals.push('Special Puja & Abhishek');
    if (/bhajan|kirtan/i.test(desc)) rituals.push('Bhajan & Kirtan');
    if (/prasad|mahaprasad/i.test(desc)) rituals.push('Community Mahaprasad');
    if (/cultural|dance|drama/i.test(desc)) rituals.push('Cultural Programs & Performances');
    if (/havan|yagna/i.test(desc)) rituals.push('Sacred Havan / Yajna');
    if (rituals.length === 0) {
      rituals.push('Devotional Prayers & Satsang', 'Community Gathering');
    }
    return rituals;
  }

  private extractDeities(event: any): string[] {
    const desc = `${event.title} ${event.description || ''} ${event.templeName || ''}`;
    const deities: string[] = [];
    if (/krishna|radha/i.test(desc)) deities.push('Lord Krishna & Radha');
    if (/shiva|mahadev/i.test(desc)) deities.push('Lord Shiva');
    if (/ram|rama|sita/i.test(desc)) deities.push('Lord Rama');
    if (/lakshmi/i.test(desc)) deities.push('Goddess Lakshmi');
    if (/ganesh|ganapati/i.test(desc)) deities.push('Lord Ganesha');
    if (/durga|devi/i.test(desc)) deities.push('Goddess Durga');
    if (/hanuman/i.test(desc)) deities.push('Lord Hanuman');
    if (deities.length === 0) {
      deities.push('All Sanatan Deities');
    }
    return deities;
  }
}