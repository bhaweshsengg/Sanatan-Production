import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-viewdirectory',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './viewdirectory.component.html',
  styleUrl: './viewdirectory.component.css'
})
export class ViewdirectoryComponent implements OnInit {
  toastMessage: any;
  toastType: any;
  showToast: any;
  businessId: any;
  businessData: any = null; // Property to store the API response data
  isLoading: boolean = true; // Loading indicator

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Retrieve the ID from the route snapshot
    this.businessId = this.route.snapshot.paramMap.get('id');

    if (this.businessId) {
      this.fetchBusinessDetails(this.businessId);
    }
  }

  fetchBusinessDetails(id: string): void {
    this.isLoading = true;
    const apiUrl = `${environment.apiBaseUrl}/business/${id}`;
    
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          this.businessData = { ...response.data, images: response.data.images ?? [] };
          console.log('Fetched Business Data:', this.businessData);
        } else {
          // Handle error if success is false
          console.error('API returned an error:', response.message);
          this.showToastMessage('Failed to fetch business details.', 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('There was an error fetching the data:', error);
        this.showToastMessage('An error occurred. Please try again later.', 'error');
        this.isLoading = false;
      }
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    // Implementation of toast message logic
    // (You can leave this as is if it works for your project)
  }
}