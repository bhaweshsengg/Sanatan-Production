// temple.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// City interface (for reference)
export interface City {
  id: number;
  name: string;
}

// Deity interface (for reference)
export interface Deity {
  id: number;
  name: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
// Temple interface for frontend use
export interface Temple {
  message: string;
  id?: number;

  // Required API fields
  mandir_name: string; // Temple name
  full_address: string; // Complete address
  city_id: number; // Foreign key (sending)
  city?: City; // Expanded object (receiving)
  year_established: string | number;
  main_deity_id: number; // Foreign key (sending)
  main_deity?: Deity; // Expanded object (receiving)
  service_offered: string[]; // Services offered (array in frontend)
  facilities_offered: string[]; // Facilities offered (array in frontend)
  phone_no: string; // Contact number
  website: string; // Website URL
  opening_hours: string; // Temple timings
  your_name: string; // Contact person name
  your_email: string; // Contact person email
  email: string; // Keep this if API has a separate email
  rating: number; // Rating (integer only)

  // Additional fields
  description: string; // Temple description
  location: string; // Geo / location field
  review: string;
  contactRole: string;

  // Optional fields
  uploaded_images?: Array<{
    file: string; 
  }>;
images?: Array<{
  id: number;
  file: string;
  temple: number;
}>;
  created_at?: string; // Timestamp (ISO format)
  updated_at?: string; // Timestamp (ISO format)
}
export interface Business {
  id?: string | number;
  // Business Details
  businessName: string;
  category: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;

  // Owner & Additional Details
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  services?: string;
  operatingHours?: string;
  specialOffers?: string;

  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;

  // Status
  status: string; // e.g., "Pending"

  // Images
  imageUrls?: string[]; // Optional if backend later stores URLs after upload
  images?: Array<{ file: string }>;
}


// Interface for API payload (what gets sent to backend)
// Interface for API payload (what gets sent to backend)
interface TempleAPIPayload {
  id?: number;
  mandir_name: string;
  full_address: string;
  city_id: number;
  year_established: string | number;
  main_deity_id: number;
  service_offered: string[]; // Change to array
  facilities_offered: string[]; // Change to array
  phone_no: string;
  website: string;
  opening_hours: string;
  your_name: string;
  your_email: string;
  email: string;
  rating: number;
  description: string;
  location: string;
  review: string;
  contactRole: string;
  images?: Array<{
    id: number;
    file: string;
    temple: number;
  }>;
  created_at?: string;
  updated_at?: string;
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private apiUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Generic error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const status = error?.status ?? 'unknown';
      const url = error?.url ?? 'unknown URL';
      const message = error?.message ?? 'Unknown HTTP error';

      console.error(`[${operation}] HTTP error`, {
        status,
        url,
        message,
        error,
      });

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

transformToAPIPayload(temple: Temple): TempleAPIPayload {
    return {
      ...temple,
      website: this.ensureValidURL(temple.website), // Ensure URL is valid
      opening_hours: this.formatOpeningHours(temple.opening_hours), // Format time properly
    };
  }


 transformFromAPIResponse(apiTemple: any): Temple {
  return {
    ...apiTemple,
    service_offered: typeof apiTemple.service_offered === 'string' 
      ? apiTemple.service_offered.split(', ').filter((s: string) => s.trim() !== '')
      : apiTemple.service_offered || [],
    facilities_offered: typeof apiTemple.facilities_offered === 'string'
      ? apiTemple.facilities_offered.split(', ').filter((f: string) => f.trim() !== '')
      : apiTemple.facilities_offered || [],
  };
}

  // Ensure URL has proper format
ensureValidURL(url: string): string {
    if (!url) return '';
    
    // If URL doesn't start with http:// or https://, add https://
    if (url && !url.match(/^http?:\/\//)) {
      return `http://${url}`;
    }
    
    return url;
  }

  // Format opening hours to match Django time format expectations
formatOpeningHours(hours: string): string {
    if (!hours) return '';
  
    return hours; // For now, return as is - you may need custom parsing logic here
  }

  private unwrapResponse<T>(response: any): T {
    if (response && Object.prototype.hasOwnProperty.call(response, 'data')) {
      return response.data as T;
    }
    return response as T;
  }

  // Temple methods
  getTemples(): Observable<Temple[]> {
    return this.http
      .get<any>(`${this.apiUrl}/temple`)
      .pipe(
        map((response: any) => {
          const temples = this.unwrapResponse<any[]>(response) ?? [];
          return Array.isArray(temples) ? temples.map(temple => this.transformFromAPIResponse(temple)) : [];
        }),
        catchError(this.handleError<Temple[]>('getTemples', []))
      );
  }

  getTemplebyId(id: number): Observable<Temple> {
    return this.http
      .get<any>(`${this.apiUrl}/temple/${id}`)
      .pipe(
        map((response: any) => {
          const temple = this.unwrapResponse<any>(response);
          return this.transformFromAPIResponse(temple);
        }),
        catchError(this.handleError<Temple>('getTemple'))
      );
  }

// In common.service.ts
createTemple(formData: FormData): Observable<any> {
  return this.http
    .post<ApiResponse<Temple>>(`${this.apiUrl}/temple`, formData)
    .pipe(
      map((response: ApiResponse<Temple>) => {
        const temple = this.unwrapResponse<Temple>(response);
        return this.transformFromAPIResponse(temple);
      }),
      catchError(this.handleError<Temple>('createTemple'))
    );
}



updateTemple(id: number, formData: FormData): Observable<Temple> {
  return this.http
    .put<any>(`${this.apiUrl}/temple/${id}`, formData)
    .pipe(
      map((response: any) => this.transformFromAPIResponse(response)),
      catchError(this.handleError<Temple>('updateTemple'))
    );
}

  deleteTemple(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/temple/${id}`)
      .pipe(catchError(this.handleError<void>('deleteTemple')));
  }

  // Utility method for file conversion
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // City methods
  getCities(): Observable<City[]> {
    return this.http
      .get<any>(`${this.apiUrl}/city`)
      .pipe(
        map((response: any) => this.unwrapResponse<City[]>(response) ?? []),
        catchError(this.handleError<City[]>('getCities', []))
      );
  }

  // Deity methods
  getDeities(): Observable<Deity[]> {
    return this.http
      .get<any>(`${this.apiUrl}/deity`)
      .pipe(
        map((response: any) => this.unwrapResponse<Deity[]>(response) ?? []),
        catchError(this.handleError<Deity[]>('getDeities', []))
      );
  }


addBusiness(businessData: Business | FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/business/add`, businessData).pipe(
    catchError(error => {
      console.error('Error submitting business:', error);
      return throwError(() => new Error('Something went wrong. Please try again later.'));
    })
  );
}
getBusinesses(): Observable<any[]> {
  return this.http
    .get<any>(`${this.apiUrl}/business`)
    .pipe(
      map((response: any) => {
        const businesses = this.unwrapResponse<any[]>(response) ?? [];
        return Array.isArray(businesses)
          ? businesses.map((business) => ({ ...business, images: business.images ?? [] }))
          : [];
      }),
      catchError(this.handleError<any[]>('getBusinesses', []))
    );
}

}