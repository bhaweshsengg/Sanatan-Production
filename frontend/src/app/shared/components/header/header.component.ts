// header.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(300),
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
  template: `
    <header
      class="bg-white shadow-lg fixed top-0 z-50 w-full transition-all duration-300"
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center cursor-pointer" routerLink="/">
            <div class="flex-shrink-0 flex items-center">
              <div
                class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                ॐ
              </div>
              <div class="ml-3">
                <h1
                  class="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                >
                  Sanatan New Zealand
                </h1>
                <p class="text-sm text-black-700">Sanatan Community Platform</p>
              </div>
            </div>
          </div>

          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a
                routerLink="/temples"
                routerLinkActive="text-orange-600 border-b-2 border-orange-600"
                class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent"
              >
                Temples
              </a>
              <a
                routerLink="/events"
                routerLinkActive="text-orange-600 border-b-2 border-orange-600"
                class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent"
              >
                Events
              </a>
           <!--

  routerLink="/business/directory"
  routerLinkActive="text-orange-600 border-b-2 border-orange-600"
  class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent"
>
  Business
</a>
-->
              <a
                routerLink="/community"
                routerLinkActive="text-orange-600 border-b-2 border-orange-600"
                class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent"
              >
                Community
              </a>
              <a
                routerLink="/help"
                routerLinkActive="text-orange-600 border-b-2 border-orange-600"
                class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent"
              >
                Help
              </a>
              <div class="relative">
                <a
                  (click)="toggleSpiritualToolsDropdown()"
                  class="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200 border-b-2 border-transparent"
                >
                  Spirituals
                </a>

                <div
                  *ngIf="isSpiritualToolsDropdownOpen"
                  class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div class="py-1">
                    <a
                      routerLink="/festival"
                      (click)="closeSpiritualToolsDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      Festival
                    </a>
                    <a
                      routerLink="/panchang"
                      (click)="closeSpiritualToolsDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      Panchang
                    </a>
                  </div>
                </div>
              </div>

              <!-- Admin Dropdown -->
              <div *ngIf="isAdmin" class="relative">
                <a
                  (click)="toggleAdminDropdown()"
                  class="text-orange-600 hover:text-orange-700 px-3 py-2 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2 border-transparent flex items-center gap-1"
                >
                  Admin
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </a>

                <div
                  *ngIf="isAdminDropdownOpen"
                  class="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div class="py-1">
                    <a
                      routerLink="/business/admin/business-submissions"
                      (click)="closeAdminDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      🏛️ Temples &amp; Businesses
                    </a>
                    <a
                      routerLink="/admin/events"
                      (click)="closeAdminDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      📅 Events
                    </a>
                    <a
                      routerLink="/admin/user-approvals"
                      (click)="closeAdminDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      👥 User Approvals
                    </a>
                    <a
                      routerLink="/admin/cities"
                      (click)="closeAdminDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      📍 Cities
                    </a>
                    <a
                      routerLink="/admin/deities"
                      (click)="closeAdminDropdown()"
                      routerLinkActive="bg-gray-100 text-orange-600"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    >
                      🕉️ Deities
                    </a>
                  </div>
                </div>
              </div>

              <button
                routerLink="/dashboard"
                class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Explore
              </button>

              <!-- Updated Login/Logout Button -->
              <button
                *ngIf="!isLoggedIn; else logoutButton"
                routerLink="/auth/login-registeration-forget"
                class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mx-3 mt-2 hover:from-orange-700 hover:to-red-700 transition-all"
              >
                Login
              </button>

              <ng-template #logoutButton>
                <button
                  (click)="onLogout()"
                  class="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium mx-3 mt-2 hover:from-gray-700 hover:to-gray-900 transition-all"
                >
                  Logout
                </button>
              </ng-template>
            </div>
          </div>

          <div class="md:hidden">
            <button
              (click)="toggleMobileMenu()"
              class="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600 transition-colors"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  *ngIf="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  *ngIf="isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          *ngIf="isMobileMenuOpen"
          [@slideIn]
          class="md:hidden bg-white border-t border-gray-200 py-4"
        >
          <div class="flex flex-col space-y-2">
            <a
              routerLink="/temples"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              Temples
            </a>
            <a
              routerLink="/events"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              Events
            </a>
            <a
              routerLink="/community"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              Community
            </a>
            <a
              routerLink="/help"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              Help
            </a>
            <div class="px-3">
              <a
                (click)="toggleSpiritualToolsDropdown()"
                class="block text-gray-700 hover:text-orange-600 text-sm font-medium cursor-pointer py-2"
              >
                Spirituals
              </a>
              <div
                *ngIf="isSpiritualToolsDropdownOpen"
                class="flex flex-col pl-4 space-y-2"
              >
                <a
                  routerLink="/festival"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-gray-100 text-orange-600"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 rounded-md"
                >
                  Festival
                </a>
                <a
                  routerLink="/panchang"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-gray-100 text-orange-600"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 rounded-md"
                >
                  Panchang
                </a>
              </div>
            </div>
            <div *ngIf="isAdmin" class="px-3 border-t border-gray-100 pt-2">
              <span class="block text-xs font-semibold uppercase text-orange-600 tracking-wider mb-1">Admin Panel</span>
              <a
                routerLink="/business/admin/business-submissions"
                (click)="closeMobileMenu()"
                class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
              >
                🏛️ Temples &amp; Businesses
              </a>
              <a
                routerLink="/admin/events"
                (click)="closeMobileMenu()"
                class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
              >
                📅 Events
              </a>
              <a
                routerLink="/admin/user-approvals"
                (click)="closeMobileMenu()"
                class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
              >
                👥 User Approvals
              </a>
              <a
                routerLink="/admin/cities"
                (click)="closeMobileMenu()"
                class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
              >
                📍 Cities
              </a>
              <a
                routerLink="/admin/deities"
                (click)="closeMobileMenu()"
                class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
              >
                🕉️ Deities
              </a>
            </div>

            <button
              routerLink="/dashboard"
              class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mx-3 mt-2 hover:from-orange-700 hover:to-red-700 transition-all"
            >
              Explore
            </button>

            <!-- Updated Login/Logout Button for Mobile -->
            <button
              *ngIf="!isLoggedIn; else mobileLogoutButton"
              routerLink="/auth/login-registeration-forget"
              (click)="closeMobileMenu()"
              class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mx-3 mt-2 hover:from-orange-700 hover:to-red-700 transition-all"
            >
              Login
            </button>

            <ng-template #mobileLogoutButton>
              <button
                (click)="onLogout(); closeMobileMenu()"
                class="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium mx-3 mt-2 hover:from-gray-700 hover:to-gray-900 transition-all"
              >
                Logout
              </button>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;
  isSpiritualToolsDropdownOpen = false;
  isBusinessesDropdownOpen = false;
  isAdminDropdownOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkScroll();
    this.checkAdminStatus();
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        this.checkAdminStatus();
      }
    );
  }

  private checkAdminStatus() {
    const user = this.authService.getUserData();
    this.isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login-registeration-forget']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!event.target) {
      return;
    }

    const targetElement = event.target as HTMLElement;
    const spiritualToolsLink = document.querySelector(
      'a.hover\\:text-orange-600.px-3.py-2.text-sm.font-medium.cursor-pointer[onclick*="toggleSpiritualToolsDropdown"]'
    );
    const businessesLink = document.querySelector(
      'a.hover\\:text-orange-600.px-3.py-2.text-sm.font-medium.cursor-pointer[onclick*="toggleBusinessesDropdown"]'
    );
    const spiritualToolsDropdown = document.querySelector('.absolute.z-10');

    if (
      spiritualToolsLink &&
      !spiritualToolsLink.contains(targetElement) &&
      spiritualToolsDropdown &&
      !spiritualToolsDropdown.contains(targetElement)
    ) {
      this.isSpiritualToolsDropdownOpen = false;
    }

    if (
      businessesLink &&
      !businessesLink.contains(targetElement) &&
      spiritualToolsDropdown &&
      !spiritualToolsDropdown.contains(targetElement)
    ) {
      this.isBusinessesDropdownOpen = false;
    }
  }

  private checkScroll() {
    this.isScrolled = window.pageYOffset > 10;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isSpiritualToolsDropdownOpen = false;
      this.isBusinessesDropdownOpen = false;
      this.isAdminDropdownOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.isSpiritualToolsDropdownOpen = false;
    this.isBusinessesDropdownOpen = false;
    this.isAdminDropdownOpen = false;
  }

  toggleSpiritualToolsDropdown() {
    this.isSpiritualToolsDropdownOpen = !this.isSpiritualToolsDropdownOpen;
    this.isBusinessesDropdownOpen = false;
    this.isAdminDropdownOpen = false;
  }

  closeSpiritualToolsDropdown() {
    this.isSpiritualToolsDropdownOpen = false;
  }

  toggleBusinessesDropdown() {
    this.isBusinessesDropdownOpen = !this.isBusinessesDropdownOpen;
    this.isSpiritualToolsDropdownOpen = false;
    this.isAdminDropdownOpen = false;
  }

  closeBusinessesDropdown() {
    this.isBusinessesDropdownOpen = false;
  }

  toggleAdminDropdown() {
    this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    this.isSpiritualToolsDropdownOpen = false;
    this.isBusinessesDropdownOpen = false;
  }

  closeAdminDropdown() {
    this.isAdminDropdownOpen = false;
  }
}