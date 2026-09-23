import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/shared/common.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { TermsConditionsModalComponent } from 'src/app/shared/components/terms-conditions-modal/terms-conditions-modal.component';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TermsConditionsModalComponent],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
})
export class DirectoryComponent implements OnInit {
  businesses: any[] = [];
  filteredBusinesses: any[] = [];
  loading = true;

  searchTerm = '';
  selectedCategory = 'All';
  selectedCity = 'All';

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
    'Career Development',
    'Other'
  ];

  cities: string[] = ['All'];

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Appointment Modal State
  selectedServiceForAppointment: any = null;
  isSubmittingAppointment = false;
  isTermsModalOpen = false;
  isAppointmentSubmittedAttempt = false;
  appointmentForm = {
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceName: '',
    notes: '',
    termsAccepted: false,
  };

  constructor(
    private commonService: CommonService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCities();
    this.fetchServices();
  }

  loadCities(): void {
    this.commonService.getCities().subscribe({
      next: (data: any[]) => {
        const standardCities = [
          'All',
          'Auckland',
          'Wellington',
          'Christchurch',
          'Hamilton',
          'Tauranga',
          'Napier-Hastings',
          'Dunedin',
          'Palmerston North',
          'Nelson',
          'Rotorua',
          'New Plymouth',
          'Whangarei',
          'Invercargill',
          'Queenstown'
        ];
        if (Array.isArray(data) && data.length > 0) {
          const apiCities = data
            .map((c) => (typeof c === 'string' ? c : c.city || c.name))
            .filter(Boolean);
          this.cities = Array.from(new Set([...standardCities, ...apiCities]));
        } else {
          this.cities = standardCities;
        }
      },
      error: () => {
        this.cities = [
          'All',
          'Auckland',
          'Wellington',
          'Christchurch',
          'Hamilton',
          'Tauranga',
          'Napier-Hastings',
          'Dunedin',
          'Palmerston North',
          'Nelson',
          'Rotorua',
          'New Plymouth',
          'Whangarei',
          'Invercargill',
          'Queenstown'
        ];
      }
    });
  }

  fetchServices(): void {
    this.loading = true;
    // Query approved services
    this.commonService.getBusinesses({ status: 'Approved', limit: 'all' }).subscribe({
      next: (data) => {
        const approved = Array.isArray(data)
          ? data.filter((b: any) => !b.status || b.status === 'Approved')
          : [];
        this.businesses = approved;

        // Dynamically add any city found in active listings
        approved.forEach((b: any) => {
          if (b.city && !this.cities.includes(b.city)) {
            this.cities.push(b.city);
          }
        });

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

  setCity(city: string): void {
    this.selectedCity = city;
    this.filterServices();
  }

  filterServices(): void {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.selectedCategory;
    const city = this.selectedCity;

    this.filteredBusinesses = this.businesses.filter((biz) => {
      const matchesCategory =
        cat === 'All' ||
        (biz.category && biz.category.toLowerCase().includes(cat.toLowerCase()));

      const matchesCity =
        city === 'All' ||
        (biz.city && biz.city.toLowerCase().trim() === city.toLowerCase().trim());

      const matchesSearch =
        !q ||
        (biz.businessName && biz.businessName.toLowerCase().includes(q)) ||
        (biz.ownerName && biz.ownerName.toLowerCase().includes(q)) ||
        (biz.category && biz.category.toLowerCase().includes(q)) ||
        (biz.description && biz.description.toLowerCase().includes(q)) ||
        (biz.city && biz.city.toLowerCase().includes(q)) ||
        (biz.address && biz.address.toLowerCase().includes(q)) ||
        (biz.services && biz.services.toLowerCase().includes(q));

      return matchesCategory && matchesCity && matchesSearch;
    });
  }

  resetAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedCity = 'All';
    this.filterServices();
  }

  // Appointment Modal
  openAppointmentModal(biz: any): void {
    this.selectedServiceForAppointment = biz;
    const user = this.authService.getUserData();

    // Calculate tomorrow's date formatted as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split('T')[0];

    this.isAppointmentSubmittedAttempt = false;
    this.appointmentForm = {
      fullName: user ? `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
      phone: user?.mobile || user?.phone || '',
      preferredDate: defaultDateStr,
      preferredTime: '10:00 AM',
      serviceName: biz.businessName || 'General Service',
      notes: '',
      termsAccepted: false,
    };
  }

  closeAppointmentModal(): void {
    this.selectedServiceForAppointment = null;
    this.isSubmittingAppointment = false;
  }

  submitAppointment(): void {
    this.isAppointmentSubmittedAttempt = true;
    if (
      !this.appointmentForm.fullName.trim() ||
      !this.appointmentForm.email.trim() ||
      !this.appointmentForm.phone.trim() ||
      !this.appointmentForm.preferredDate.trim()
    ) {
      this.showToastMessage('Please fill in your name, email, phone, and preferred date.', 'error');
      return;
    }

    if (!this.appointmentForm.termsAccepted) {
      this.showToastMessage('You must agree to the Terms and Conditions to book an appointment.', 'error');
      return;
    }

    this.isSubmittingAppointment = true;
    const bizId = this.selectedServiceForAppointment.id;
    const payload = {
      ...this.appointmentForm,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    };

    this.commonService.requestAppointment(bizId, payload).subscribe({
      next: (res: any) => {
        this.isSubmittingAppointment = false;
        const msg = res?.message || 'Appointment requested successfully! The provider will contact you shortly.';
        this.showToastMessage(msg, 'success');
        this.closeAppointmentModal();
      },
      error: (err: any) => {
        this.isSubmittingAppointment = false;
        const msg = err?.error?.message || err?.message || 'Failed to submit appointment request. Please try again.';
        this.showToastMessage(msg, 'error');
      },
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
    }, 4000);
  }
}
