import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/shared/common.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TermsConditionsModalComponent } from 'src/app/shared/components/terms-conditions-modal/terms-conditions-modal.component';

@Component({
  selector: 'app-viewdirectory',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule, TermsConditionsModalComponent],
  templateUrl: './viewdirectory.component.html',
  styleUrl: './viewdirectory.component.css'
})
export class ViewdirectoryComponent implements OnInit, OnDestroy {
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;
  businessId: string | null = null;
  businessData: any = null;
  isLoading: boolean = true;
  private routeSub?: Subscription;

  // Appointment Modal State
  isAppointmentModalOpen = false;
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
    private route: ActivatedRoute,
    private http: HttpClient,
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.businessId = params.get('id');
      if (this.businessId) {
        this.fetchBusinessDetails(this.businessId);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  fetchBusinessDetails(id: string): void {
    this.isLoading = true;
    const apiUrl = `${environment.apiBaseUrl}/business/${id}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          const raw = response.data;
          this.businessData = {
            ...raw,
            mobile: raw.mobile || raw.ownerPhone || null,
            phone: raw.phone || raw.phoneNo || null,
            phoneNo: raw.phoneNo || raw.phone || null,
            ownerPhone: raw.ownerPhone || raw.mobile || null,
            images: raw.images ?? (raw.imageUrl ? [{ file: raw.imageUrl }] : [])
          };
        } else {
          this.showToastMessage('Failed to fetch business details.', 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching service details:', error);
        this.showToastMessage('An error occurred loading service details.', 'error');
        this.isLoading = false;
      }
    });
  }

  resolveImageUrl(imgCandidate: any): string {
    if (!imgCandidate) return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80';
    const candidate = typeof imgCandidate === 'string' ? imgCandidate : imgCandidate?.file;
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

  openAppointmentModal(): void {
    if (!this.businessData) return;
    const user = this.authService.getUserData();

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
      serviceName: this.businessData.businessName || 'General Community Service',
      notes: '',
      termsAccepted: false,
    };
    this.isAppointmentModalOpen = true;
  }

  closeAppointmentModal(): void {
    this.isAppointmentModalOpen = false;
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

    if (!this.businessId) return;

    this.isSubmittingAppointment = true;
    const payload = {
      ...this.appointmentForm,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    };

    this.commonService.requestAppointment(this.businessId, payload).subscribe({
      next: (res: any) => {
        this.isSubmittingAppointment = false;
        const msg = res?.message || 'Appointment requested successfully! The provider will contact you.';
        this.showToastMessage(msg, 'success');
        this.closeAppointmentModal();
      },
      error: (err: any) => {
        this.isSubmittingAppointment = false;
        const msg = err?.error?.message || err?.message || 'Failed to submit appointment request. Please try again.';
        this.showToastMessage(msg, 'error');
      }
    });
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