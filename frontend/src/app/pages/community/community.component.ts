import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service';
import { CommunityService, CommunityGroup, CommunityMember } from './community.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
      <!-- Gradient Header -->
      <header class="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 py-12 md:py-16 text-white shadow-md relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-orange-100 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <span>🕉️</span> Sanatan Community Hub
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Connect, Share & Grow Together
          </h1>
          <p class="text-base sm:text-lg text-orange-100 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Uniting Hindu devotees, satsang circles, youth groups, and families across Aotearoa New Zealand.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            <button
              routerLink="/community/discussion/new"
              class="bg-white text-orange-600 hover:text-orange-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow hover:bg-orange-50 flex items-center gap-2 transition-all text-sm sm:text-base active:scale-95"
            >
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Start Discussion
            </button>
            <button
              (click)="openCreateGroupModal()"
              class="bg-orange-700/80 hover:bg-orange-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow border border-orange-400/40 flex items-center gap-2 transition-all text-sm sm:text-base active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Create Local Group
            </button>
            <button
              routerLink="/events/add-event"
              class="bg-white/15 hover:bg-white/25 text-white font-medium px-4 py-2.5 rounded-lg border border-white/30 flex items-center gap-2 transition-all text-sm sm:text-base"
            >
              <span class="text-lg leading-none">+</span> Add Event
            </button>
          </div>
        </div>
      </header>

      <!-- Sticky Navigation Tabs -->
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center space-x-1 sm:space-x-8 overflow-x-auto no-scrollbar">
            <button
              (click)="setActiveTab('groups')"
              [ngClass]="{
                'border-orange-600 text-orange-600 font-bold bg-orange-50/50 sm:bg-transparent': activeTab === 'groups',
                'border-transparent text-slate-600 hover:text-slate-900 font-medium': activeTab !== 'groups'
              }"
              class="py-3.5 sm:py-4 px-3 sm:px-4 border-b-2 flex items-center gap-2 text-sm sm:text-base transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Local Groups</span>
              <span class="ml-1 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-semibold">{{ groups.length }}</span>
            </button>

            <button
              (click)="setActiveTab('members')"
              [ngClass]="{
                'border-orange-600 text-orange-600 font-bold bg-orange-50/50 sm:bg-transparent': activeTab === 'members',
                'border-transparent text-slate-600 hover:text-slate-900 font-medium': activeTab !== 'members'
              }"
              class="py-3.5 sm:py-4 px-3 sm:px-4 border-b-2 flex items-center gap-2 text-sm sm:text-base transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span>Community Members</span>
              <span *ngIf="membersCount > 0" class="ml-1 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">{{ membersCount }}</span>
            </button>

            <button
              (click)="setActiveTab('discussions')"
              [ngClass]="{
                'border-orange-600 text-orange-600 font-bold bg-orange-50/50 sm:bg-transparent': activeTab === 'discussions',
                'border-transparent text-slate-600 hover:text-slate-900 font-medium': activeTab !== 'discussions'
              }"
              class="py-3.5 sm:py-4 px-3 sm:px-4 border-b-2 flex items-center gap-2 text-sm sm:text-base transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>Discussions</span>
              <span class="ml-1 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">{{ discussions.length }}</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Alert Toast Notification -->
      <div *ngIf="notification" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div
          [ngClass]="{
            'bg-emerald-50 border-emerald-300 text-emerald-800': notification.type === 'success',
            'bg-rose-50 border-rose-300 text-rose-800': notification.type === 'error',
            'bg-blue-50 border-blue-300 text-blue-800': notification.type === 'info'
          }"
          class="p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all"
        >
          <div class="flex items-center gap-3 text-sm font-medium">
            <span *ngIf="notification.type === 'success'">✅</span>
            <span *ngIf="notification.type === 'error'">⚠️</span>
            <span *ngIf="notification.type === 'info'">ℹ️</span>
            <span>{{ notification.message }}</span>
          </div>
          <button (click)="notification = null" class="text-current opacity-70 hover:opacity-100 text-sm font-bold ml-4">✕</button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="py-8 sm:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <!-- ============================================================== -->
          <!-- 1. LOCAL GROUPS TAB                                            -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'groups'" class="space-y-6">
            <!-- Search, Category Filter & Action Bar -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div class="flex flex-col sm:flex-row gap-3 flex-1">
                <!-- Search Input -->
                <div class="relative flex-1">
                  <input
                    type="text"
                    [(ngModel)]="groupSearch"
                    (input)="filterGroups()"
                    placeholder="Search groups by name, city, topic..."
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all"
                  />
                  <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
                  </svg>
                  <button *ngIf="groupSearch" (click)="groupSearch = ''; filterGroups()" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <!-- Category Dropdown -->
                <select
                  [(ngModel)]="selectedCategory"
                  (change)="filterGroups()"
                  class="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Family">Family & Kids</option>
                  <option value="Satsang">Satsang & Bhajan</option>
                  <option value="Youth">Youth & Students</option>
                  <option value="Cultural & Seva">Cultural & Seva</option>
                  <option value="Study Group">Scripture & Sanskrit</option>
                  <option value="Senior Citizens">Senior Devotees</option>
                </select>
              </div>

              <!-- Create Group CTA Button -->
              <button
                (click)="openCreateGroupModal()"
                class="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow transition-all active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Create Group</span>
              </button>
            </div>

            <!-- Loading State -->
            <div *ngIf="loadingGroups" class="py-16 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-3"></div>
              <p class="text-sm text-slate-500 font-medium">Loading local community groups...</p>
            </div>

            <!-- Groups Grid -->
            <div *ngIf="!loadingGroups" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let group of filteredGroups"
                class="bg-white rounded-2xl border border-slate-200 hover:border-orange-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div class="p-6">
                  <!-- Category & City Pill Header -->
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span [ngClass]="getCategoryBadgeClass(group.category)" class="text-xs font-semibold px-2.5 py-1 rounded-full">
                      {{ group.category }}
                    </span>
                    <span *ngIf="group.cityName" class="text-xs text-slate-500 flex items-center gap-1 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      <svg class="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ group.cityName }}
                    </span>
                  </div>

                  <!-- Group Title -->
                  <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {{ group.name }}
                  </h3>

                  <!-- Description -->
                  <p class="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {{ group.description }}
                  </p>

                  <!-- Metadata Details -->
                  <div class="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div *ngIf="group.meetingInfo" class="flex items-center gap-2">
                      <span class="text-slate-400">🗓️</span>
                      <span class="font-medium text-slate-700">{{ group.meetingInfo }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs pt-1">
                      <span class="flex items-center gap-1.5 font-medium text-slate-600">
                        <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                        </svg>
                        <strong class="text-slate-900">{{ group.memberCount }}</strong> {{ group.memberCount === 1 ? 'Member' : 'Members' }}
                      </span>
                      <span class="text-slate-400">Led by {{ group.creatorName || 'Devotee' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Card Actions -->
                <div class="bg-slate-50 border-t border-slate-100 px-6 py-3.5 flex items-center justify-between gap-2">
                  <button
                    (click)="viewGroupDetails(group)"
                    class="text-xs font-semibold text-orange-700 hover:text-orange-800 hover:underline flex items-center gap-1 transition-colors"
                  >
                    View Details &amp; Members →
                  </button>

                  <div class="flex items-center gap-2">
                    <!-- Edit Button for Admin or Creator -->
                    <button
                      *ngIf="canManageGroup(group)"
                      (click)="openEditGroupModal(group)"
                      class="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-white border border-slate-200"
                      title="Edit group"
                    >
                      ✏️ Edit
                    </button>

                    <!-- Join / Leave Toggle Button -->
                    <button
                      *ngIf="!group.isMember"
                      (click)="promptJoinGroup(group)"
                      class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      Join Group
                    </button>

                    <button
                      *ngIf="group.isMember"
                      (click)="leaveGroup(group)"
                      class="bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 hover:border-rose-300 transition-all group/btn"
                    >
                      <span class="group-hover/btn:hidden">✓ Joined</span>
                      <span class="hidden group-hover/btn:inline">Leave Group</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loadingGroups && filteredGroups.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div class="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                👥
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">No Local Groups Found</h3>
              <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">
                {{ groupSearch ? 'No groups match your search criteria. Try a different search or category.' : 'Be the first to create a local group in your city or neighborhood!' }}
              </p>
              <button
                (click)="openCreateGroupModal()"
                class="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm text-sm inline-flex items-center gap-2"
              >
                + Create New Group
              </button>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 2. MEMBERS DIRECTORY TAB                                       -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'members'" class="space-y-6">
            <!-- Search & Filters -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div class="relative flex-1">
                <input
                  type="text"
                  [(ngModel)]="memberSearch"
                  (input)="filterMembers()"
                  placeholder="Search members by name, temple, or city..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all"
                />
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
                </svg>
                <button *ngIf="memberSearch" (click)="memberSearch = ''; filterMembers()" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <!-- Role Filter -->
              <div class="flex items-center gap-2 overflow-x-auto">
                <select
                  [(ngModel)]="selectedRole"
                  (change)="filterMembers()"
                  class="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Devotee">Registered Devotees</option>
                  <option value="Admin">Administrators</option>
                  <option value="TempleManager">Temple Committee</option>
                  <option value="User">Community Members</option>
                </select>

                <span class="text-xs text-slate-500 font-medium whitespace-nowrap bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
                  Showing {{ filteredMembers.length }} devotees
                </span>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="loadingMembers" class="py-16 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-3"></div>
              <p class="text-sm text-slate-500 font-medium">Loading community member directory...</p>
            </div>

            <!-- Members Grid -->
            <div *ngIf="!loadingMembers" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                *ngFor="let member of filteredMembers"
                class="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
                (click)="selectedMemberProfile = member"
              >
                <!-- Avatar Initial -->
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-xl flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                  {{ getInitials(member.name) }}
                </div>

                <!-- Name -->
                <h4 class="font-bold text-slate-900 text-base mb-1 group-hover:text-orange-600 transition-colors">
                  {{ member.name }}
                </h4>

                <!-- Role Badge -->
                <span [ngClass]="getRoleBadgeClass(member.role)" class="text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2">
                  {{ member.role }}
                </span>

                <!-- Affiliation & City -->
                <p class="text-xs text-slate-600 font-medium line-clamp-1 mb-1">{{ member.affiliation }}</p>
                <p *ngIf="member.cityName" class="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  📍 {{ member.cityName }}
                </p>

                <!-- Groups info pill -->
                <div class="mt-auto w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Groups: <strong class="text-slate-800">{{ member.groupCount }}</strong></span>
                  <span class="text-orange-600 font-semibold text-xs">Profile →</span>
                </div>
              </div>
            </div>

            <!-- Empty Members State -->
            <div *ngIf="!loadingMembers && filteredMembers.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <p class="text-slate-500 text-sm">No community members found matching your search.</p>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 3. DISCUSSIONS TAB                                             -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'discussions'" class="space-y-6">
            <div class="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div class="relative w-full sm:max-w-md">
                <input
                  type="text"
                  [(ngModel)]="discussionSearch"
                  (input)="filterDiscussions()"
                  placeholder="Search discussions..."
                  class="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
                </svg>
              </div>
              <button
                routerLink="/community/discussion/new"
                class="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 flex items-center gap-2 transition-colors font-semibold text-sm shadow-sm w-full sm:w-auto justify-center"
              >
                <span class="text-lg leading-none">+</span> New Discussion
              </button>
            </div>

            <!-- Topic Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="text-xs font-semibold text-slate-500 py-1 mr-2">Popular tags:</span>
              <span (click)="discussionSearch = 'diwali'; filterDiscussions()" class="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 cursor-pointer hover:bg-orange-100">#diwali2024</span>
              <span (click)="discussionSearch = 'vegetarian'; filterDiscussions()" class="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 cursor-pointer hover:bg-orange-100">#vegetarian-recipes</span>
              <span (click)="discussionSearch = 'sanskrit'; filterDiscussions()" class="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 cursor-pointer hover:bg-orange-100">#sanskrit-learning</span>
              <span (click)="discussionSearch = 'temple'; filterDiscussions()" class="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 cursor-pointer hover:bg-orange-100">#temple-events</span>
              <span (click)="discussionSearch = 'yoga'; filterDiscussions()" class="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 cursor-pointer hover:bg-orange-100">#yoga-classes</span>
            </div>

            <!-- Discussions List -->
            <div *ngFor="let discussion of filteredDiscussions" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4 hover:border-orange-200 transition-colors">
              <h3 class="font-bold text-lg text-slate-900 mb-1.5">{{ discussion.title }}</h3>
              <p class="text-sm text-slate-600 mb-4 leading-relaxed">{{ discussion.content }}</p>

              <div class="flex flex-wrap gap-2 mb-4">
                <span *ngFor="let tag of discussion.tags" class="text-xs bg-orange-50 text-orange-800 px-2.5 py-0.5 rounded-md border border-orange-200 font-medium">#{{ tag }}</span>
                <span class="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">{{ discussion.category }}</span>
              </div>

              <div class="flex flex-wrap items-center text-xs text-slate-500 gap-4 pt-3 border-t border-slate-100">
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full mr-2 bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                    {{ discussion.authorName ? discussion.authorName.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <span class="font-medium text-slate-800">{{ discussion.authorName }}</span>
                </div>
                <div *ngIf="discussion.cityName" class="flex items-center gap-1">
                  📍 <span>{{ discussion.cityName }}</span>
                </div>
                <span>{{ formatDate(discussion.createdAt) }}</span>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredDiscussions.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p class="text-slate-500 text-sm">No discussions found matching your criteria.</p>
            </div>
          </div>

        </div>
      </main>

      <!-- ============================================================== -->
      <!-- MODAL: GROUP DETAILS & MEMBERS LIST                            -->
      <!-- ============================================================== -->
      <div *ngIf="selectedGroupDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span [ngClass]="getCategoryBadgeClass(selectedGroupDetails.category)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {{ selectedGroupDetails.category }}
                </span>
                <span *ngIf="selectedGroupDetails.cityName" class="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  📍 {{ selectedGroupDetails.cityName }}
                </span>
              </div>
              <h2 class="text-2xl font-bold text-slate-900">{{ selectedGroupDetails.name }}</h2>
            </div>
            <button (click)="selectedGroupDetails = null" class="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-slate-200">
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Description -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Group</h4>
              <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{{ selectedGroupDetails.description }}</p>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div *ngIf="selectedGroupDetails.meetingInfo">
                <span class="text-slate-500 font-medium block mb-0.5">Meeting Schedule</span>
                <span class="font-bold text-slate-800">🗓️ {{ selectedGroupDetails.meetingInfo }}</span>
              </div>
              <div *ngIf="selectedGroupDetails.contactEmail">
                <span class="text-slate-500 font-medium block mb-0.5">Contact Email</span>
                <a [href]="'mailto:' + selectedGroupDetails.contactEmail" class="font-bold text-orange-600 hover:underline">✉️ {{ selectedGroupDetails.contactEmail }}</a>
              </div>
              <div *ngIf="selectedGroupDetails.contactPhone">
                <span class="text-slate-500 font-medium block mb-0.5">Contact Phone</span>
                <span class="font-bold text-slate-800">📞 {{ selectedGroupDetails.contactPhone }}</span>
              </div>
              <div>
                <span class="text-slate-500 font-medium block mb-0.5">Organizer</span>
                <span class="font-bold text-slate-800">👤 {{ selectedGroupDetails.creatorName || 'Devotee Lead' }}</span>
              </div>
            </div>

            <!-- Group Members List -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span>👥</span> Group Members ({{ selectedGroupDetails.members?.length || 0 }})
                </h4>
              </div>

              <div *ngIf="selectedGroupDetails.members && selectedGroupDetails.members.length > 0" class="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-56 overflow-y-auto">
                <div *ngFor="let member of selectedGroupDetails.members" class="p-3 flex items-center justify-between text-sm bg-white hover:bg-slate-50">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-900 text-sm">{{ member.name }}</div>
                      <div class="text-[11px] text-slate-400">Joined {{ formatDate(member.joinedAt) }}</div>
                    </div>
                  </div>
                  <span [ngClass]="getRoleBadgeClass(member.role)" class="text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    {{ member.role }}
                  </span>
                </div>
              </div>

              <div *ngIf="!selectedGroupDetails.members || selectedGroupDetails.members.length === 0" class="text-xs text-slate-400 italic p-3 border border-slate-200 rounded-xl text-center">
                No members have joined yet. Be the first to join!
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
            <button (click)="selectedGroupDetails = null" class="text-sm font-semibold text-slate-600 hover:text-slate-800">
              Close
            </button>

            <div>
              <button
                *ngIf="!selectedGroupDetails.isMember"
                (click)="promptJoinGroup(selectedGroupDetails)"
                class="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-sm transition-all"
              >
                Join This Group
              </button>

              <button
                *ngIf="selectedGroupDetails.isMember"
                (click)="leaveGroup(selectedGroupDetails)"
                class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- MODAL: CREATE / EDIT LOCAL GROUP                               -->
      <!-- ============================================================== -->
      <div *ngIf="showGroupModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-900">{{ isEditingGroup ? 'Edit Local Group' : 'Create New Local Group' }}</h3>
              <p class="text-xs text-slate-500 mt-0.5">Start a local community circle for devotional, cultural, or family gatherings.</p>
            </div>
            <button (click)="closeGroupModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center">
              ✕
            </button>
          </div>

          <!-- Form Body -->
          <form [formGroup]="groupForm" (ngSubmit)="saveGroup()" class="p-6 space-y-4">
            <!-- Group Name -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">
                Group Name <span class="text-rose-500">*</span>
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="e.g. Wellington Satsang & Bhajan Group"
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
              />
              <p *ngIf="groupForm.get('name')?.invalid && groupForm.get('name')?.touched" class="text-xs text-rose-600 mt-1">
                Group name must be at least 3 characters.
              </p>
            </div>

            <!-- Category & City -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Category <span class="text-rose-500">*</span>
                </label>
                <select
                  formControlName="category"
                  class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none bg-white"
                >
                  <option value="Family">Family & Kids</option>
                  <option value="Satsang">Satsang & Bhajan</option>
                  <option value="Youth">Youth & Students</option>
                  <option value="Cultural & Seva">Cultural & Seva</option>
                  <option value="Study Group">Scripture & Sanskrit</option>
                  <option value="Senior Citizens">Senior Devotees</option>
                  <option value="Other">Other Community</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  formControlName="cityName"
                  placeholder="e.g. Auckland, Wellington"
                  class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
                />
              </div>
            </div>

            <!-- Meeting Info -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Meeting Schedule / Frequency</label>
              <input
                type="text"
                formControlName="meetingInfo"
                placeholder="e.g. Every Sunday 4:00 PM or Bi-weekly Saturdays"
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">
                Description & Purpose <span class="text-rose-500">*</span>
              </label>
              <textarea
                formControlName="description"
                rows="4"
                placeholder="Describe what activities this group conducts, where members meet, and who can participate..."
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
              ></textarea>
              <p *ngIf="groupForm.get('description')?.invalid && groupForm.get('description')?.touched" class="text-xs text-rose-600 mt-1">
                Please provide at least 10 characters for description.
              </p>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  formControlName="contactEmail"
                  placeholder="coordinator@example.com"
                  class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  formControlName="contactPhone"
                  placeholder="+64 21 000 0000"
                  class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none"
                />
              </div>
            </div>

            <!-- Modal Form Buttons -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="closeGroupModal()"
                class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="submittingGroup"
                class="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span *ngIf="submittingGroup" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{{ isEditingGroup ? 'Save Changes' : 'Create Group' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- MODAL: GUEST JOIN GROUP                                        -->
      <!-- ============================================================== -->
      <div *ngIf="joiningGroup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Join {{ joiningGroup.name }}</h3>
              <p class="text-xs text-slate-500">Provide your details to connect with this local group.</p>
            </div>
            <button (click)="joiningGroup = null" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form [formGroup]="joinForm" (ngSubmit)="confirmJoinGroup()" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Full Name <span class="text-rose-500">*</span></label>
              <input
                type="text"
                formControlName="name"
                placeholder="Your Name"
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 text-sm outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Email Address <span class="text-rose-500">*</span></label>
              <input
                type="email"
                formControlName="email"
                placeholder="your.email@example.com"
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 text-sm outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                formControlName="phone"
                placeholder="+64 21 000 0000"
                class="w-full p-2.5 rounded-xl border border-slate-300 focus:border-orange-500 text-sm outline-none"
              />
            </div>

            <div class="pt-3 flex justify-end gap-2">
              <button
                type="button"
                (click)="joiningGroup = null"
                class="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="joinForm.invalid || isSubmittingJoin"
                class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-5 py-2 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
              >
                <span *ngIf="isSubmittingJoin" class="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Confirm &amp; Join</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- MODAL: MEMBER PROFILE DETAILS                                  -->
      <!-- ============================================================== -->
      <div *ngIf="selectedMemberProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            {{ getInitials(selectedMemberProfile.name) }}
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-1">{{ selectedMemberProfile.name }}</h3>
          <span [ngClass]="getRoleBadgeClass(selectedMemberProfile.role)" class="text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4">
            {{ selectedMemberProfile.role }}
          </span>

          <div class="bg-slate-50 rounded-xl p-4 text-left text-xs space-y-2.5 border border-slate-200 mb-6">
            <div class="flex justify-between">
              <span class="text-slate-500">Affiliation:</span>
              <span class="font-bold text-slate-800 text-right">{{ selectedMemberProfile.affiliation }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Location:</span>
              <span class="font-bold text-slate-800 text-right">{{ selectedMemberProfile.cityName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Member Since:</span>
              <span class="font-bold text-slate-800 text-right">{{ formatDate(selectedMemberProfile.joinedAt) }}</span>
            </div>
            <div class="flex justify-between" *ngIf="selectedMemberProfile.groups && selectedMemberProfile.groups.length > 0">
              <span class="text-slate-500">Local Groups:</span>
              <span class="font-bold text-orange-700 text-right">{{ selectedMemberProfile.groups.join(', ') }}</span>
            </div>
          </div>

          <button
            (click)="selectedMemberProfile = null"
            class="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CommunityComponent implements OnInit {
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  activeTab: 'discussions' | 'groups' | 'members' = 'groups';

  // Notifications
  notification: { type: 'success' | 'error' | 'info'; message: string } | null = null;

  // Local Groups State
  groups: CommunityGroup[] = [];
  filteredGroups: CommunityGroup[] = [];
  loadingGroups = false;
  groupSearch = '';
  selectedCategory = 'All';

  // Group Modals State
  selectedGroupDetails: CommunityGroup | null = null;
  showGroupModal = false;
  isEditingGroup = false;
  editingGroupId: number | null = null;
  submittingGroup = false;
  groupForm!: FormGroup;

  // Join Group State
  joiningGroup: CommunityGroup | null = null;
  joinForm!: FormGroup;
  isSubmittingJoin = false;

  // Members State
  members: CommunityMember[] = [];
  filteredMembers: CommunityMember[] = [];
  membersCount = 0;
  loadingMembers = false;
  memberSearch = '';
  selectedRole = 'All';
  selectedMemberProfile: CommunityMember | null = null;

  // Discussions State
  discussions: any[] = [];
  filteredDiscussions: any[] = [];
  discussionSearch = '';

  ngOnInit() {
    this.initForms();
    this.loadGroups();
    this.loadMembers();
    this.loadDiscussions();
  }

  initForms() {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['Family', Validators.required],
      cityName: [''],
      meetingInfo: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
    });

    const user = this.authService.getUserData();
    this.joinForm = this.fb.group({
      name: [user?.username || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  getCurrentUserEmail(): string {
    const user = this.authService.getUserData();
    return (user?.email || localStorage.getItem('guestDevoteeEmail') || '').toLowerCase().trim();
  }

  canManageGroup(group: CommunityGroup): boolean {
    const user = this.authService.getUserData();
    if (!user) return false;
    if (user.role === 'Admin') return true;
    if (group.creatorId && group.creatorId === user.id) return true;
    if (user.email && group.contactEmail && user.email.toLowerCase() === group.contactEmail.toLowerCase()) return true;
    return false;
  }

  // ==========================================
  // LOCAL GROUPS METHODS
  // ==========================================

  loadGroups() {
    this.loadingGroups = true;
    const userEmail = this.getCurrentUserEmail();

    this.communityService.getGroups({ userEmail }).subscribe({
      next: (res) => {
        this.loadingGroups = false;
        if (res.data) {
          this.groups = res.data;
          this.filterGroups();
        }
      },
      error: (err) => {
        this.loadingGroups = false;
        console.error('Failed to load groups:', err);
      },
    });
  }

  filterGroups() {
    const q = this.groupSearch.trim().toLowerCase();
    this.filteredGroups = this.groups.filter((g) => {
      const matchesCategory = this.selectedCategory === 'All' || g.category === this.selectedCategory;
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        (g.cityName && g.cityName.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }

  viewGroupDetails(group: CommunityGroup) {
    const userEmail = this.getCurrentUserEmail();
    this.communityService.getGroupById(group.id, userEmail).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedGroupDetails = res.data;
        }
      },
      error: () => {
        this.selectedGroupDetails = group;
      },
    });
  }

  openCreateGroupModal() {
    this.isEditingGroup = false;
    this.editingGroupId = null;
    const user = this.authService.getUserData();
    this.groupForm.reset({
      category: 'Family',
      contactEmail: user?.email || '',
    });
    this.showGroupModal = true;
  }

  openEditGroupModal(group: CommunityGroup) {
    this.isEditingGroup = true;
    this.editingGroupId = group.id;
    this.groupForm.patchValue({
      name: group.name,
      category: group.category,
      cityName: group.cityName || '',
      meetingInfo: group.meetingInfo || '',
      description: group.description,
      contactEmail: group.contactEmail || '',
      contactPhone: group.contactPhone || '',
    });
    this.showGroupModal = true;
  }

  closeGroupModal() {
    this.showGroupModal = false;
    this.groupForm.reset();
  }

  saveGroup() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.submittingGroup = true;
    const formVal = this.groupForm.value;

    if (this.isEditingGroup && this.editingGroupId) {
      this.communityService.updateGroup(this.editingGroupId, formVal).subscribe({
        next: () => {
          this.submittingGroup = false;
          this.closeGroupModal();
          this.showNotification('success', 'Local group updated successfully!');
          this.loadGroups();
          if (this.selectedGroupDetails?.id === this.editingGroupId) {
            this.viewGroupDetails({ id: this.editingGroupId } as any);
          }
        },
        error: (err) => {
          this.submittingGroup = false;
          this.showNotification('error', err?.error?.message || 'Failed to update group');
        },
      });
    } else {
      this.communityService.createGroup(formVal).subscribe({
        next: () => {
          this.submittingGroup = false;
          this.closeGroupModal();
          this.showNotification('success', 'Local group created successfully!');
          this.loadGroups();
        },
        error: (err) => {
          this.submittingGroup = false;
          this.showNotification('error', err?.error?.message || 'Failed to create group');
        },
      });
    }
  }

  promptJoinGroup(group: CommunityGroup) {
    const user = this.authService.getUserData();
    if (user?.email) {
      // User is logged in, join immediately!
      this.executeJoin(group, {
        name: user.username || 'Devotee',
        email: user.email,
      });
    } else {
      // Prompt guest modal
      this.joiningGroup = group;
      this.joinForm.patchValue({
        name: localStorage.getItem('guestDevoteeName') || '',
        email: localStorage.getItem('guestDevoteeEmail') || '',
      });
    }
  }

  confirmJoinGroup() {
    if (this.joinForm.invalid || !this.joiningGroup) return;

    this.isSubmittingJoin = true;
    const val = this.joinForm.value;

    // Save for convenience
    localStorage.setItem('guestDevoteeName', val.name);
    localStorage.setItem('guestDevoteeEmail', val.email);

    this.executeJoin(this.joiningGroup, val);
  }

  executeJoin(group: CommunityGroup, memberData: { name: string; email: string; phone?: string }) {
    this.communityService.joinGroup(group.id, memberData).subscribe({
      next: (res) => {
        this.isSubmittingJoin = false;
        this.joiningGroup = null;
        group.isMember = true;
        group.memberCount = (group.memberCount || 0) + 1;
        if (this.selectedGroupDetails?.id === group.id) {
          this.selectedGroupDetails.isMember = true;
          this.selectedGroupDetails.memberCount = (this.selectedGroupDetails.memberCount || 0) + 1;
          this.selectedGroupDetails.members = [
            ...(this.selectedGroupDetails.members || []),
            {
              id: Date.now(),
              name: memberData.name,
              role: 'Member',
              joinedAt: new Date().toISOString(),
            },
          ];
        }
        this.showNotification('success', res.message || `Successfully joined ${group.name}!`);
        this.loadMembers();
      },
      error: (err) => {
        this.isSubmittingJoin = false;
        this.showNotification('error', err?.error?.message || 'Failed to join group.');
      },
    });
  }

  leaveGroup(group: CommunityGroup) {
    const email = this.getCurrentUserEmail();
    if (!email) {
      this.showNotification('error', 'Please provide your email to leave the group.');
      return;
    }

    if (!confirm(`Are you sure you want to leave ${group.name}?`)) return;

    this.communityService.leaveGroup(group.id, email).subscribe({
      next: () => {
        group.isMember = false;
        group.memberCount = Math.max(0, (group.memberCount || 1) - 1);
        if (this.selectedGroupDetails?.id === group.id) {
          this.selectedGroupDetails.isMember = false;
          this.selectedGroupDetails.memberCount = Math.max(0, (this.selectedGroupDetails.memberCount || 1) - 1);
          this.selectedGroupDetails.members = (this.selectedGroupDetails.members || []).filter(
            (m) => m.name.toLowerCase() !== (this.authService.getUserData()?.username || '').toLowerCase()
          );
        }
        this.showNotification('info', `You have left ${group.name}`);
        this.loadMembers();
      },
      error: (err) => {
        this.showNotification('error', err?.error?.message || 'Failed to leave group');
      },
    });
  }

  // ==========================================
  // MEMBERS DIRECTORY METHODS
  // ==========================================

  loadMembers() {
    this.loadingMembers = true;
    this.communityService.getMembers({ limit: 50 }).subscribe({
      next: (res) => {
        this.loadingMembers = false;
        if (res.data) {
          this.members = res.data;
          this.membersCount = res.pagination?.total || res.data.length;
          this.filterMembers();
        }
      },
      error: (err) => {
        this.loadingMembers = false;
        console.error('Failed to load members:', err);
      },
    });
  }

  filterMembers() {
    const q = this.memberSearch.trim().toLowerCase();
    this.filteredMembers = this.members.filter((m) => {
      const matchesRole = this.selectedRole === 'All' || m.role.toLowerCase() === this.selectedRole.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.affiliation.toLowerCase().includes(q) ||
        m.cityName.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }

  // ==========================================
  // DISCUSSIONS METHODS
  // ==========================================

  loadDiscussions() {
    this.communityService.getDiscussions().subscribe({
      next: (res) => {
        if (res.data) {
          this.discussions = res.data;
          this.filterDiscussions();
        }
      },
      error: (err) => console.error('Failed to load discussions', err),
    });
  }

  filterDiscussions() {
    const q = this.discussionSearch.trim().toLowerCase();
    this.filteredDiscussions = this.discussions.filter((d) => {
      return (
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================

  setActiveTab(tab: 'discussions' | 'groups' | 'members') {
    this.activeTab = tab;
  }

  showNotification(type: 'success' | 'error' | 'info', message: string) {
    this.notification = { type, message };
    setTimeout(() => {
      if (this.notification?.message === message) {
        this.notification = null;
      }
    }, 5000);
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'Family':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Satsang':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Youth':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Cultural & Seva':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Study Group':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'devotee':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'organizer':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'templemanager':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
