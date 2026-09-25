import { Component, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
      class="bg-white shadow-md fixed top-0 z-50 w-full transition-all duration-300"
    >
      <nav class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 xl:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Brand / Logo Area -->
          <div class="flex items-center cursor-pointer shrink-0 select-none py-1 mr-2 sm:mr-4" routerLink="/">
            <div class="flex items-center gap-2 sm:gap-3">
              <div
                class="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg xl:text-xl shadow-md hover:shadow-lg transition-shadow duration-300 shrink-0"
              >
                ॐ
              </div>
              <div class="flex flex-col justify-center min-w-0">
                <h1
                  class="text-sm sm:text-base md:text-lg xl:text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors tracking-tight whitespace-nowrap leading-tight"
                >
                  Sanatan New Zealand
                </h1>
                <p class="hidden sm:block lg:hidden 2xl:block text-[11px] xl:text-xs text-gray-500 font-medium whitespace-nowrap leading-tight mt-0.5">
                  Sanatan Community Platform
                </p>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation Bar -->
          <div class="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 shrink-0 ml-auto">
            <a
              routerLink="/temples"
              routerLinkActive="text-orange-600 border-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium transition-all duration-200 border-b-2 border-transparent whitespace-nowrap shrink-0"
            >
              Temples
            </a>
            <a
              routerLink="/events"
              routerLinkActive="text-orange-600 border-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium transition-all duration-200 border-b-2 border-transparent whitespace-nowrap shrink-0"
            >
              Events
            </a>

            <!-- Services Dropdown -->
            <div class="relative services-dropdown-container shrink-0">
              <button
                type="button"
                (click)="toggleBusinessesDropdown()"
                class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium cursor-pointer transition-all duration-200 border-b-2 border-transparent flex items-center gap-1 focus:outline-none whitespace-nowrap shrink-0"
                [ngClass]="{'text-orange-600 border-orange-600 font-semibold': isServicesActive()}"
              >
                <span>Services</span>
                <svg class="w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isBusinessesDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div
                *ngIf="isBusinessesDropdownOpen"
                class="absolute left-0 z-50 mt-2 w-52 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 py-1 transition-all"
              >
                <a
                  routerLink="/services"
                  (click)="closeBusinessesDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  🏛️ Service Directory
                </a>
                <a
                  routerLink="/services/add"
                  (click)="closeBusinessesDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  ➕ Add Service
                </a>
              </div>
            </div>

            <a
              routerLink="/community"
              routerLinkActive="text-orange-600 border-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium transition-all duration-200 border-b-2 border-transparent whitespace-nowrap shrink-0"
            >
              Community
            </a>
            <a
              routerLink="/help"
              routerLinkActive="text-orange-600 border-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium transition-all duration-200 border-b-2 border-transparent whitespace-nowrap shrink-0"
            >
              Help
            </a>

            <!-- Spirituals Dropdown -->
            <div class="relative spiritual-tools-dropdown shrink-0">
              <button
                type="button"
                (click)="toggleSpiritualToolsDropdown()"
                class="text-gray-700 hover:text-orange-600 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-medium cursor-pointer transition-all duration-200 border-b-2 border-transparent flex items-center gap-1 focus:outline-none whitespace-nowrap shrink-0"
                [ngClass]="{'text-orange-600 border-orange-600 font-semibold': isSpiritualsActive()}"
              >
                <span>Spirituals</span>
                <svg class="w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isSpiritualToolsDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div
                *ngIf="isSpiritualToolsDropdownOpen"
                class="absolute left-0 z-50 mt-2 w-52 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 py-1 transition-all"
              >
                <a
                  routerLink="/festival"
                  (click)="closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  🌸 Festival
                </a>
                <a
                  routerLink="/panchang"
                  (click)="closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📅 Panchang
                </a>
                <a
                  routerLink="/blog"
                  (click)="closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📰 Blog
                </a>
                <a
                  routerLink="/religiouscontents"
                  (click)="closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📜 Religious Articles
                </a>
              </div>
            </div>

            <!-- Admin Dropdown (Visible only to authenticated Admin users) -->
            <div *ngIf="isAdmin" class="relative admin-dropdown-container shrink-0">
              <a
                (click)="toggleAdminDropdown()"
                class="text-orange-600 hover:text-orange-700 px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-semibold cursor-pointer transition-all duration-200 border-b-2 border-transparent flex items-center gap-1 whitespace-nowrap shrink-0"
                [ngClass]="{'border-orange-600': isAdminActive()}"
              >
                <span>Admin</span>
                <svg class="w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isAdminDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </a>

              <div
                *ngIf="isAdminDropdownOpen"
                class="absolute right-0 z-50 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 py-1 transition-all"
              >
                <a
                  routerLink="/business/admin/business-submissions"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  🏛️ Temples &amp; Businesses
                </a>
                <a
                  routerLink="/admin/events"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📅 Events
                </a>
                <a
                  routerLink="/admin/user-approvals"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  👥 User Approvals
                </a>
                <a
                  routerLink="/admin/cities"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📍 Cities
                </a>
                <a
                  routerLink="/admin/deities"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  🕉️ Deities
                </a>
                <a
                  routerLink="/admin/blogs"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📰 Blog Posts
                </a>
                <a
                  routerLink="/admin/religious-articles"
                  (click)="closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  📜 Religious Articles
                </a>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-1.5 xl:gap-2 shrink-0 ml-1 xl:ml-2">
              <button
                routerLink="/dashboard"
                class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 xl:px-4 py-1.5 rounded-full text-[12px] xl:text-[13px] font-semibold hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow shrink-0 whitespace-nowrap"
              >
                Explore
              </button>

              <button
                *ngIf="!isLoggedIn; else logoutButton"
                routerLink="/auth/login-registeration-forget"
                class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 xl:px-4 py-1.5 rounded-full text-[12px] xl:text-[13px] font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-sm hover:shadow shrink-0 whitespace-nowrap"
              >
                Login
              </button>

              <ng-template #logoutButton>
                <button
                  (click)="onLogout()"
                  class="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 xl:px-4 py-1.5 rounded-full text-[12px] xl:text-[13px] font-semibold hover:from-gray-700 hover:to-gray-900 transition-all shadow-sm hover:shadow shrink-0 whitespace-nowrap"
                >
                  Logout
                </button>
              </ng-template>
            </div>
          </div>

          <!-- Mobile Hamburger Button -->
          <div class="lg:hidden flex items-center shrink-0">
            <button
              (click)="toggleMobileMenu()"
              aria-label="Toggle mobile navigation menu"
              class="mobile-menu-toggle-button p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:text-orange-600 transition-colors"
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

        <!-- Mobile Menu Drawer -->
        <div
          *ngIf="isMobileMenuOpen"
          [@slideIn]
          class="lg:hidden bg-white border-t border-gray-200 py-3 px-2 max-h-[calc(100vh-4.25rem)] overflow-y-auto mobile-menu-container shadow-inner"
        >
          <div class="flex flex-col space-y-1">
            <a
              routerLink="/temples"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Temples
            </a>
            <a
              routerLink="/events"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Events
            </a>

            <!-- Mobile Services Accordion -->
            <div class="px-1">
              <button
                type="button"
                (click)="toggleBusinessesDropdown()"
                class="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer focus:outline-none transition-colors"
                [ngClass]="{'text-orange-600 bg-orange-50 font-semibold': isServicesActive()}"
              >
                <span>Services</span>
                <svg class="w-4 h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isBusinessesDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div
                *ngIf="isBusinessesDropdownOpen"
                class="flex flex-col pl-3 space-y-1 mt-1 border-l-2 border-orange-300 ml-4 py-1"
              >
                <a
                  routerLink="/services"
                  (click)="closeMobileMenu(); closeBusinessesDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  🏛️ Service Directory
                </a>
                <a
                  routerLink="/services/add"
                  (click)="closeMobileMenu(); closeBusinessesDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  ➕ Add Service
                </a>
              </div>
            </div>

            <a
              routerLink="/community"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Community
            </a>
            <a
              routerLink="/help"
              (click)="closeMobileMenu()"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold"
              class="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Help
            </a>

            <!-- Mobile Spirituals Accordion -->
            <div class="px-1">
              <button
                type="button"
                (click)="toggleSpiritualToolsDropdown()"
                class="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer focus:outline-none transition-colors"
                [ngClass]="{'text-orange-600 bg-orange-50 font-semibold': isSpiritualsActive()}"
              >
                <span>Spirituals</span>
                <svg class="w-4 h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isSpiritualToolsDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div
                *ngIf="isSpiritualToolsDropdownOpen"
                class="flex flex-col pl-3 space-y-1 mt-1 border-l-2 border-orange-300 ml-4 py-1"
              >
                <a
                  routerLink="/festival"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  🌸 Festival
                </a>
                <a
                  routerLink="/panchang"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  📅 Panchang
                </a>
                <a
                  routerLink="/blog"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  📰 Blog
                </a>
                <a
                  routerLink="/religiouscontents"
                  (click)="closeMobileMenu(); closeSpiritualToolsDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  📜 Religious Articles
                </a>
              </div>
            </div>

            <!-- Mobile Admin Accordion Dropdown (Visible only to authenticated Admin users) -->
            <div *ngIf="isAdmin" class="px-1 border-t border-gray-100 pt-2">
              <button
                type="button"
                (click)="toggleAdminDropdown()"
                class="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer focus:outline-none transition-colors"
                [ngClass]="{'text-orange-600 bg-orange-50 font-semibold': isAdminActive()}"
              >
                <span>Admin Panel</span>
                <svg class="w-4 h-4 transition-transform duration-200" [ngClass]="{'rotate-180': isAdminDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div
                *ngIf="isAdminDropdownOpen"
                class="flex flex-col pl-3 space-y-1 mt-1 border-l-2 border-orange-300 ml-4 py-1"
              >
                <a
                  routerLink="/business/admin/business-submissions"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  🏛️ Temples &amp; Businesses
                </a>
                <a
                  routerLink="/admin/events"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  📅 Events
                </a>
                <a
                  routerLink="/admin/user-approvals"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  👥 User Approvals
                </a>
                <a
                  routerLink="/admin/cities"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  📍 Cities
                </a>
                <a
                  routerLink="/admin/deities"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  🕉️ Deities
                </a>
                <a
                  routerLink="/admin/blogs"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  📰 Blog Posts
                </a>
                <a
                  routerLink="/admin/religious-articles"
                  (click)="closeMobileMenu(); closeAdminDropdown()"
                  routerLinkActive="bg-orange-50 text-orange-600 font-semibold"
                  class="block px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  📜 Religious Articles
                </a>
              </div>
            </div>

            <!-- Mobile Action Buttons -->
            <div class="flex flex-col space-y-2 pt-2 px-2 border-t border-gray-100">
              <button
                routerLink="/dashboard"
                (click)="closeMobileMenu()"
                class="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-orange-700 hover:to-red-700 transition-all text-center shadow-sm"
              >
                Explore
              </button>

              <button
                *ngIf="!isLoggedIn; else mobileLogoutButton"
                routerLink="/auth/login-registeration-forget"
                (click)="closeMobileMenu()"
                class="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-orange-700 hover:to-red-700 transition-all text-center shadow-sm"
              >
                Login
              </button>

              <ng-template #mobileLogoutButton>
                <button
                  (click)="onLogout(); closeMobileMenu()"
                  class="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-900 transition-all text-center shadow-sm"
                >
                  Logout
                </button>
              </ng-template>
            </div>
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkScroll();
    this.checkAdminStatus();
    // Reactively update admin visibility on login/logout
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      this.checkAdminStatus();
    });
  }

  private checkAdminStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.isAdminDropdownOpen = false;
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.isAdminDropdownOpen = false;
    this.authService.logout();
    this.checkAdminStatus();
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
    const isInsideMobileMenu = !!targetElement.closest('.mobile-menu-container');
    const isMobileToggleButton = !!targetElement.closest('.mobile-menu-toggle-button');

    // On mobile: clicks inside the mobile menu must not trigger desktop click-outside close logic
    if (isInsideMobileMenu || isMobileToggleButton) {
      return;
    }

    // On desktop: close open dropdowns when clicking outside their desktop containers
    const spiritualToolsContainer = this.elementRef?.nativeElement?.querySelector('.spiritual-tools-dropdown');
    const adminDropdownContainer = this.elementRef?.nativeElement?.querySelector('.admin-dropdown-container');
    const servicesDropdownContainer = this.elementRef?.nativeElement?.querySelector('.services-dropdown-container');

    if (spiritualToolsContainer && !spiritualToolsContainer.contains(targetElement)) {
      this.isSpiritualToolsDropdownOpen = false;
    }

    if (adminDropdownContainer && !adminDropdownContainer.contains(targetElement)) {
      this.isAdminDropdownOpen = false;
    }

    if (servicesDropdownContainer && !servicesDropdownContainer.contains(targetElement)) {
      this.isBusinessesDropdownOpen = false;
    }

    // If clicked outside mobile menu while mobile menu is open, close it
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  isSpiritualsActive(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/festival') ||
      url.startsWith('/panchang') ||
      url.startsWith('/blog') ||
      url.startsWith('/religiouscontents')
    );
  }

  isServicesActive(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/services') ||
      url.startsWith('/business/directory') ||
      url.startsWith('/business/register')
    );
  }

  isAdminActive(): boolean {
    const url = this.router.url;
    return url.startsWith('/admin') || url.startsWith('/business/admin');
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
    if (this.isSpiritualToolsDropdownOpen) {
      this.isBusinessesDropdownOpen = false;
      this.isAdminDropdownOpen = false;
    }
  }

  closeSpiritualToolsDropdown() {
    this.isSpiritualToolsDropdownOpen = false;
  }

  toggleBusinessesDropdown() {
    this.isBusinessesDropdownOpen = !this.isBusinessesDropdownOpen;
    if (this.isBusinessesDropdownOpen) {
      this.isSpiritualToolsDropdownOpen = false;
      this.isAdminDropdownOpen = false;
    }
  }

  closeBusinessesDropdown() {
    this.isBusinessesDropdownOpen = false;
  }

  toggleAdminDropdown() {
    this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    if (this.isAdminDropdownOpen) {
      this.isSpiritualToolsDropdownOpen = false;
      this.isBusinessesDropdownOpen = false;
    }
  }

  closeAdminDropdown() {
    this.isAdminDropdownOpen = false;
  }
}