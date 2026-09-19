import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/shared/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
})
export class DirectoryComponent implements OnInit {
  businesses: any[] = [];
  filteredBusinesses: any[] = [];
  loading = true;

  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = [
    'All',
    'Priest / Purohit / Pandit Services',
    'Pooja & Ritual Services',
    'Astrology & Vastu Shastra',
    'Catering & Prasad / Food',
    'Wedding & Event Services',
    'Music, Bhajan & Cultural Arts',
    'Traditional Attire & Puja Items',
    'Education, Yoga & Sanskrit',
    'Health & Ayurveda Wellness',
    'Community Welfare & Volunteer',
    'Justice of Peace',
    'IT & Professional Services',
    'Other'
  ];

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.loading = true;
    this.commonService.getBusinesses().subscribe({
      next: (data) => {
        const approved = Array.isArray(data)
          ? data.filter((business: any) => !business.status || business.status === 'Approved')
          : [];
        this.businesses = approved;
        this.filterServices();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching services/businesses', err);
        this.loading = false;
      },
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterServices();
  }

  filterServices(): void {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategory;

    this.filteredBusinesses = this.businesses.filter((biz) => {
      const matchesCategory =
        cat === 'All' ||
        (biz.category && biz.category.toLowerCase().includes(cat.toLowerCase()));

      const matchesSearch =
        !q ||
        (biz.businessName && biz.businessName.toLowerCase().includes(q)) ||
        (biz.ownerName && biz.ownerName.toLowerCase().includes(q)) ||
        (biz.category && biz.category.toLowerCase().includes(q)) ||
        (biz.description && biz.description.toLowerCase().includes(q)) ||
        (biz.city && biz.city.toLowerCase().includes(q)) ||
        (biz.address && biz.address.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }

  resolveImageUrl(biz: any): string {
    const candidate = biz.imageUrl || (biz.images && biz.images.length > 0 ? biz.images[0].file : null);
    if (!candidate) return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80';
    if (candidate.startsWith('http://') || candidate.startsWith('https://')) return candidate;
    const backendOrigin = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
    const cleanPath = candidate.startsWith('/') ? candidate : `/${candidate}`;
    return `${backendOrigin}${cleanPath}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80';
    }
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
    }, 3000);
  }
}
