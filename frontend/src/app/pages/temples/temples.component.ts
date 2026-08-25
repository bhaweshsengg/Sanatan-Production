import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Temple {
status: string;
  id: number;
  name: string;
  deity: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  established: string;
  contact: string;
  address: string;
  city: string;
  mainDeity: string;
  phone: string;
  email: string;
  website: string;
  timings: string;
  services: string[];
  facilities: string[];
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
}

interface ApiTemple {
status:string;
  id: number;
  mandir_name: string;
  full_address: string;
  city: {
    id: number;
    name: string;
  };
  year_established: number;
  main_deity: {
    id: number;
    name: string;
  };
  description: string;
  service_offered: string[];
  facilities_offered: string[];
  images: {
    file: string;
  }[];
  phone_no: string;
  email: string;
  website: string;
  opening_hours: string;
  your_name: string;
  your_email: string;
  rating: number;
  location: string;
}

interface City {
  id: number;
  name: string;
}

interface Deity {
  id: number;
  name: string;
}

@Component({
  selector: 'app-temples',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <!-- Hero Section with Search -->
      <section class="bg-gradient-to-r from-orange-500 to-red-600 py-20">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <!-- Heading -->
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Sanatan Mandir in New Zealand
          </h1>
          <p class="text-lg md:text-xl text-orange-100 mb-8">
            Discover sacred spaces across Aotearoa where devotees gather to
            worship and celebrate
          </p>

          <!-- Search + Filters -->
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <!-- Search Input -->
            <div class="relative flex-1 max-w-md">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterTemples()"
                placeholder="Search mandirs, cities, or deities..."
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- City Filter -->
            <select
              [(ngModel)]="selectedLocation"
              (change)="filterTemples()"
              class="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option *ngFor="let city of cities" [value]="city.name">{{ city.name }}</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="text-center py-12">
        <div class="text-6xl mb-4">⏳</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Loading temples...</h3>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="text-center py-12 text-red-500">
        {{ errorMessage }}
      </div>

      <!-- Temples Grid -->
      <section class="py-12" *ngIf="!isLoading && !errorMessage">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              *ngFor="let temple of filteredTemples"
              class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div class="relative">
                <div class="grid grid-cols-2 gap-2 p-2">
                  <img
                    *ngFor="let image of temple.images; let i = index"
                    [src]="image"
                    [alt]="temple.name + ' image ' + (i + 1)"
                    class="w-full h-40 object-cover rounded-lg"
                    (error)="onImageError($event)"
                  />
                </div>
                <div
                  class="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-lg"
                >
                  <span class="text-yellow-500 mr-1">⭐</span>
                  <span class="text-sm font-medium">{{ temple.rating }}</span>
                </div>
                <div
                  class="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ temple.category }}
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ temple.name }}
                </h3>
                <div class="flex items-center text-sm text-black-700 mb-3">
                  <span class="text-orange-600 font-medium">{{
                    temple.deity
                  }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ temple.location }}</span>
                </div>
                <p class="text-black-700 mb-4 line-clamp-2">
                  {{ temple.description }}
                </p>

                <div class="flex items-center justify-between mb-4">
                  <div class="text-sm text-gray-500">
                    <span class="mr-4">📅 Est. {{ temple.established }}</span>
                  </div>
                  <div class="flex items-center text-sm !text-gray-500">
                    <span class="mr-1">❤️</span>
                    <span>{{ temple.reviews }} reviews</span>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    [routerLink]="['/temples/view-temple',temple.id]"
                    class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Visit Temple
                  </button>
                  <button
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    📞
                  </button>
                  <button
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    📍
                  </button>
                </div>
              </div>
            </div>
          </div>
          <section class="bg-orange-50 py-12 mt-10">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Know of a Mandir that's not listed?
              </h2>
              <p class="text-black-700 mb-6">
                Help us build a comprehensive directory of Sanatan Mandir in New
                Zealand. Submit Mandir information to help fellow devotees
                discover sacred spaces.
              </p>
              <button
                routerLink="/temples/add-temple"
                class="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
              >
                + Add Temple
              </button>
            </div>
          </section>
          <div *ngIf="filteredTemples.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🛕</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              No temples found
            </h3>
            <p class="text-black-700">Try adjusting your search criteria</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class TemplesComponent implements OnInit {
  searchTerm = '';
  selectedLocation = '';
  selectedCategory = '';

  temples: Temple[] = [];
  filteredTemples: Temple[] = [];
  cities: City[] = [];
  deities: Deity[] = [];
  isLoading = true;
  errorMessage = '';

  // Fallback image used whenever a temple has no image, or the image fails to load
  private readonly defaultImage = '/assets/temple_images/temple1.jpg';

  private apiUrl = environment.apiBaseUrl;

  // Root backend origin (without the /api or /api/public suffix), used to
  // resolve relative image paths like "/temple_images/xxx.jpg" returned by the API.
  private backendOrigin = environment.apiBaseUrl.replace(/\/api(\/public)?\/?$/, '');

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadCities();
    this.loadDeities();
    this.getTemples().subscribe({
      next: (temples) => {
        this.temples = temples;
        this.filteredTemples = [...this.temples];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching temples:', error);
        this.errorMessage = 'Failed to load temples. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getTemples(): Observable<Temple[]> {
    return this.http
      .get<any>(`${this.apiUrl}/temple`)
      .pipe(
        map((response: any) => {
          const apiTemples = response && response.data ? response.data : response;
          const temples = Array.isArray(apiTemples) ? apiTemples : [];
          return temples
            .map((temple: ApiTemple) => this.transformFromAPIResponse(temple))
            .filter((a: any) => a.status === 'Approved');
        }),
        catchError(error => {
          console.error('API Error:', error);
          return of([]);
        })
      );
  }

  loadCities() {
    this.http.get<any>(`${this.apiUrl}/city`).subscribe({
      next: (response) => {
        const cities = response && response.data ? response.data : response;
        this.cities = Array.isArray(cities) ? cities : [];
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        // Fallback to default cities if API fails
        this.cities = [
          { id: 1, name: 'Auckland' },
          { id: 2, name: 'Christchurch' },
          { id: 3, name: 'Wellington' },
          { id: 4, name: 'Hamilton' },
          { id: 5, name: 'Tauranga' },
          { id: 6, name: 'Dunedin' },
          { id: 7, name: 'Lower Hutt' },
          { id: 8, name: 'Palmerston North' },
          { id: 9, name: 'Napier' },
          { id: 10, name: 'Porirua' },
          { id: 11, name: 'Invercargill' },
          { id: 12, name: 'Nelson' },
          { id: 13, name: 'Upper Hutt' }
        ];
      },
    });
  }

  loadDeities() {
    this.http.get<any>(`${this.apiUrl}/deity`).subscribe({
      next: (response) => {
        const deities = response && response.data ? response.data : response;
        this.deities = Array.isArray(deities) ? deities : [];
      },
      error: (error) => {
        console.error('Error loading deities:', error);
        // Fallback to default deities if API fails
        this.deities = [
          { id: 1, name: 'Krishna' },
          { id: 2, name: 'Shiva' },
          { id: 3, name: 'Vishnu' },
          { id: 4, name: 'Multiple Deities' }
        ];
      },
    });
  }

  /**
   * Resolves an image path coming from the API into a fully-qualified URL.
   * - Empty/missing -> default placeholder
   * - Already absolute (http/https) -> used as-is
   * - Relative (e.g. "/temple_images/xxx.jpg") -> prefixed with the backend origin
   */
  private resolveImageUrl(file: string | undefined | null): string {
    if (!file) {
      return '';
    }
    if (/^https?:\/\//i.test(file)) {
      return file;
    }
    const path = file.startsWith('/') ? file : `/${file}`;
    return `${this.backendOrigin}${path}`;
  }

  /**
   * Called from the template when an <img> fails to load (broken link, 404, etc.)
   * Swaps it to the default placeholder so the UI never shows a broken image icon.
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallback'] === 'true') {
      return;
    }

    img.dataset['fallback'] = 'true';
    img.src = this.defaultImage;
  }

  private transformFromAPIResponse(apiTemple: ApiTemple): Temple {
  const images = (apiTemple.images ?? [])
    .map((image) => this.resolveImageUrl(image.file))
    .filter(Boolean);
  const resolvedImages = images.length > 0 ? images : [this.defaultImage];

  return {
    id: apiTemple.id,
    name: apiTemple.mandir_name,
    deity: apiTemple.main_deity.name,
    location: apiTemple.city.name,
    rating: apiTemple.rating,
    reviews: 0,
    image: resolvedImages[0],
    images: resolvedImages,
    description: apiTemple.description,
    category: apiTemple.main_deity.name,
    established: apiTemple.year_established.toString(),
    contact: apiTemple.phone_no,
    address: apiTemple.full_address,
    city: apiTemple.city.name,
    mainDeity: apiTemple.main_deity.name,
    phone: apiTemple.phone_no,
    email: apiTemple.email,
    website: apiTemple.website,
    timings: apiTemple.opening_hours,
    services: apiTemple.service_offered,
    facilities: apiTemple.facilities_offered,
    contactPerson: apiTemple.your_name,
    contactRole: 'Contact',
    contactEmail: apiTemple.your_email,
    status: apiTemple.status // Add this line
  };
}

  filterTemples() {
    this.filteredTemples = this.temples.filter((temple) => {
      const matchesSearch =
        temple.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        temple.deity.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        temple.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        temple.city.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesLocation =
        !this.selectedLocation || 
        temple.location === this.selectedLocation || 
        temple.city === this.selectedLocation;
        
      const matchesCategory =
        !this.selectedCategory || 
        temple.category === this.selectedCategory || 
        temple.deity === this.selectedCategory;

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }

  editTemple(templeId: number | string) {
    this.router.navigate(['/temples/edit-temple', templeId]);
  }

}