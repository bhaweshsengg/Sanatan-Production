import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-conditions-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="title"
    >
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        (click)="close()"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 my-auto flex flex-col max-h-[90vh]"
      >
        <!-- Modal Header -->
        <div class="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ॐ
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {{ modalTitle }}
              </h3>
              <p class="text-xs text-slate-500 font-medium">
                Sanatan Community Platform &bull; Legal Terms &amp; Guidelines
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="close()"
            class="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 w-8 h-8 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close Terms and Conditions Modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="px-5 py-4 sm:px-6 sm:py-5 overflow-y-auto space-y-5 text-slate-700 text-sm leading-relaxed flex-1">
          <!-- Last Updated Banner -->
          <div class="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <svg class="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-xs text-orange-900 leading-normal">
              Please read these terms carefully before submitting your registration. By checking the consent checkbox, you agree to comply with and be bound by the guidelines below.
            </p>
          </div>

          <!-- USER ACCOUNT REGISTRATION TERMS -->
          <div *ngIf="termsType === 'user'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> User Account &amp; Eligibility
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                By creating a user account on Sanatan New Zealand, you affirm that the information provided (including your name, email, and designated role) is accurate and current. You agree not to impersonate any individual or provide falsified information.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Account Security
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You are solely responsible for maintaining the confidentiality of your credentials and password. Any actions performed under your account are your legal responsibility. If you suspect unauthorized access, notify our administration immediately.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Community Code of Conduct &amp; Dharma
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Our platform is dedicated to fostering spiritual unity, cultural preservation, and mutual respect. Zero tolerance is maintained for harassment, discriminatory language, profanity, hate speech, defamation, or unsolicited commercial advertising.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Privacy &amp; Data Safeguards
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                We handle your contact details in accordance with New Zealand Privacy Principles. Your personal information is utilized strictly to provide access to platform features, coordinate event enrollments, and support community connectivity. We do not sell your personal data.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">5.</span> Account Suspension &amp; Modifications
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                The platform administration reserves the right to suspend, restrict, or terminate user access if an account violates community safety standards or applicable legislation.
              </p>
            </div>
          </div>

          <!-- DEVOTEE REGISTRATION TERMS -->
          <div *ngIf="termsType === 'devotee'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Devotee Community Affiliation
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Devotee registration associates you with your selected Mandir community for religious participation, festival celebrations, and temple seva opportunities. You confirm that you are registering with genuine devotional intent.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Reverence for Mandir Sanctity &amp; Bylaws
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Devotees agree to uphold the sanctity, peace, and spiritual sanctity of the temple premises. You agree to abide by the respective Mandir management committee's rules, priest instructions, customary dress guidelines, and code of conduct.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Application Review &amp; Admin Approval Process
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All devotee registrations undergo verification by the Mandir administration. Submission of this form does not automatically grant approval; the Temple committee reserves the prerogative to approve or decline applications to protect community safety.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Community Communications Consent
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                By opting into community updates, you grant permission to the temple administration to send announcements regarding pujas, festivals, volunteer seva, and important temple notices to your registered email and mobile number. You may adjust your preferences at any time.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">5.</span> Devotee Data Privacy
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Your contact details are shared exclusively with the authorized temple administration of your chosen Mandir for community governance and religious operations.
              </p>
            </div>
          </div>

          <!-- BUSINESS REGISTRATION TERMS -->
          <div *ngIf="termsType === 'business'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Business Listing Purpose &amp; Verification
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                The Sanatan Business Directory connects community members with businesses and services. You confirm that you are the lawful owner or authorized representative of the enterprise being registered.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Truthful Advertising &amp; New Zealand Law
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You guarantee that all business descriptions, pricing representations, addresses, and images are truthful, lawful, and compliant with the New Zealand Fair Trading Act, Consumer Guarantees Act, and relevant commercial regulations.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Community Standards &amp; Ethical Business
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Listings must be ethical and consistent with community values. Content involving counterfeit items, predatory financial schemes, or misleading advertisements is strictly prohibited.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Review, Approval, &amp; Delisting Rights
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Every business submission enters an initial "Pending" review state. Platform administrators retain full authority to approve, reject, or subsequent delist any business listing that receives verified community complaints or breaches these terms.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">5.</span> Limitation of Platform Liability
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Sanatan New Zealand acts as a directory connector only and is not a party to commercial contracts, warranties, or disputes between listed businesses and their customers.
              </p>
            </div>
          </div>

          <!-- TEMPLE LISTING TERMS -->
          <div *ngIf="termsType === 'temple'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Authentic Mandir Information
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You certify that the submitted temple information, address, deities, history, and opening hours are authentic and intended to help devotees discover sacred spaces across New Zealand.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Community Directory Review &amp; Approval
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All temple submissions are verified by administrators before being published to ensure accurate details, authentic imagery, and community alignment.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Respect for Temple Sanctity &amp; Public Good
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                The information provided must respect the sanctity and dignity of the Mandir. False listings, offensive media, or unauthorized commercial promotions will be rejected or delisted immediately.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Authorized Contact Representation
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You confirm that you have reasonable authority or affiliation to submit this temple information, or are submitting it in good faith as a community devotee with verifiable public details.
              </p>
            </div>
          </div>

          <!-- COMMUNITY EVENT TERMS -->
          <div *ngIf="termsType === 'event'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Accurate Event Information
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You affirm that the event name, dates, timings, venue, description, and participating Mandir are genuine and accurate. Any event updates or cancellations must be communicated promptly.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Cultural &amp; Spiritual Alignment
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All community events published on Sanatan New Zealand must respect Sanatan Dharma, cultural harmony, and community goodwill. Events promoting intolerance, partisan political agendas, or discord will not be approved.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Safety, Compliance, &amp; Venue Permissions
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Event organizers are solely responsible for ensuring compliance with New Zealand health, safety, fire regulations, and obtaining prior consent from the relevant temple committee or facility manager.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Moderation &amp; Editorial Rights
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                The platform administration reserves the right to review, edit formatting, request clarifications, or decline event submissions that do not meet community standards.
              </p>
            </div>
          </div>

          <!-- COMMUNITY SERVICE PROVIDER TERMS -->
          <div *ngIf="termsType === 'service'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Authentic Service Representation
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                You certify that you possess the necessary qualifications, traditions, and knowledge for religious rites, rituals, priestly services, music, astrology, or community offerings advertised in your profile.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Transparent Dakshina &amp; Fees
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All suggested fees, honorariums, or Dakshina expectations must be disclosed transparently to devotees. Hidden charges or exploitative practices are strictly prohibited.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Devotee Respect &amp; Professional Conduct
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Service providers agree to treat all devotees with the highest degree of respect, dignity, punctuality, and cultural sensitivity.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">4.</span> Directory Moderation
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All service provider profiles are subject to administrative review before being published. The platform reserves the right to remove any listing in the event of validated devotee complaints.
              </p>
            </div>
          </div>

          <!-- SERVICE APPOINTMENT / BOOKING TERMS -->
          <div *ngIf="termsType === 'appointment'" class="space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">1.</span> Direct Provider Agreement
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                This booking request directly connects you with the independent service provider or priest. Sanatan New Zealand facilitates the introduction but is not a party to the appointment contract.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">2.</span> Punctuality &amp; Courtesy
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                Devotees agree to provide accurate contact details, confirm appointment times promptly, and inform the provider well in advance if rescheduling or cancellation is necessary.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span class="text-orange-600 font-extrabold">3.</span> Mutual Agreement on Rituals &amp; Dakshina
              </h4>
              <p class="mt-1 text-slate-600 text-xs sm:text-sm">
                All samagri (puja items), preparation requirements, and Dakshina/honorarium should be mutually clarified directly with the provider before the commencement of the service.
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <p class="text-[11px] text-slate-500 text-center sm:text-left">
            By accepting, you confirm your consent to these terms.
          </p>
          <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              (click)="close()"
              class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition shadow-sm"
            >
              Close
            </button>
            <button
              type="button"
              (click)="acceptAndClose()"
              class="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl transition shadow-md shadow-orange-600/20"
            >
              I Agree &amp; Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TermsConditionsModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() termsType: 'user' | 'devotee' | 'business' | 'temple' | 'event' | 'service' | 'appointment' = 'user';

  @Output() closed = new EventEmitter<void>();
  @Output() accepted = new EventEmitter<void>();

  get modalTitle(): string {
    if (this.title) return this.title;
    switch (this.termsType) {
      case 'user':
        return 'User Account Terms & Conditions';
      case 'devotee':
        return 'Temple Devotee Registration Terms';
      case 'business':
        return 'Business Listing Terms & Conditions';
      case 'temple':
        return 'Mandir Directory Submission Terms';
      case 'event':
        return 'Community Event Guidelines & Terms';
      case 'service':
        return 'Community Service Provider Terms';
      case 'appointment':
        return 'Service Appointment Booking Terms';
      default:
        return 'Terms and Conditions';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.close();
    }
  }

  close() {
    this.closed.emit();
  }

  acceptAndClose() {
    this.accepted.emit();
    this.closed.emit();
  }
}
