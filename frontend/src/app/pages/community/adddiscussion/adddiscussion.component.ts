import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-adddiscussion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="flex flex-col items-center pt-16 mt-10 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100">
      <div class="flex flex-col items-center text-center mb-8">
        <div class="p-4 bg-orange-500 rounded-full text-white mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 12.016a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800">Start a Discussion</h1>
      </div>

      <div class="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
        <form [formGroup]="discussionForm" (ngSubmit)="onSubmit()">
          <!-- Title -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">Title <span class="text-red-500">*</span></label>
            <input formControlName="title" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Best places for vegetarian food in Auckland?" />
          </div>

          <!-- Category & City -->
          <div class="mb-4 flex flex-col sm:flex-row sm:space-x-4">
            <div class="flex-1 mb-4 sm:mb-0">
              <label class="block text-gray-700 text-sm font-medium mb-1">Category <span class="text-red-500">*</span></label>
              <select formControlName="category" class="w-full p-2 border border-gray-300 rounded-md bg-white">
                <option value="">Select category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Events">Events</option>
                <option value="Culture">Culture</option>
                <option value="General">General</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 text-sm font-medium mb-1">Relevant City</label>
              <select formControlName="cityId" class="w-full p-2 border border-gray-300 rounded-md bg-white">
                <option value="">None</option>
                <option *ngFor="let city of cities" [value]="city.id">{{ city.name }}</option>
              </select>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">Content <span class="text-red-500">*</span></label>
            <textarea formControlName="content" class="w-full p-2 border border-gray-300 rounded-md min-h-[150px]"></textarea>
          </div>

          <!-- Tags -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-1">Tags (comma separated)</label>
            <input formControlName="tags" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. food, vegan, auckland" />
          </div>

          <button type="submit" [disabled]="isLoading || discussionForm.invalid" class="w-full bg-orange-600 text-white p-3 rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50">
            {{ isLoading ? 'Posting...' : 'Post Discussion' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AdddiscussionComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  discussionForm: FormGroup;
  cities: any[] = [];
  isLoading = false;

  constructor() {
    this.discussionForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      cityId: [''],
      content: ['', Validators.required],
      tags: ['']
    });
  }

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.http.get<any>(`${environment.apiBaseUrl}/public/city`).subscribe({
      next: (res) => {
        if (res.data) this.cities = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.discussionForm.invalid) return;

    this.isLoading = true;
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const formValue = this.discussionForm.value;
    const payload = {
      ...formValue,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : []
    };

    this.http.post(`${environment.apiBaseUrl}/community/discussions`, payload, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/community']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Failed to post discussion. Ensure you are logged in.');
      }
    });
  }
}
