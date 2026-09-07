import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans">
      <!-- Gradient Header -->
      <header class="bg-gradient-to-r from-orange-500 to-red-600 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">Community Hub</h1>
          <p class="text-lg text-orange-100 mb-8">
            Connect, share, and grow together with the Hindu community across New Zealand
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button routerLink="/community/discussion/new" class="bg-white text-orange-600 font-medium px-6 py-2 rounded-md hover:bg-gray-50 shadow-md flex items-center gap-2 transition-colors">
              <span class="text-lg">+</span> Start Discussion
            </button>
            <button routerLink="/events/add-event" class="bg-white text-orange-600 font-medium px-6 py-2 rounded-md hover:bg-gray-50 shadow-md flex items-center gap-2 transition-colors">
              <span class="text-lg">+</span> Create Event
            </button>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="bg-white shadow z-10 sticky top-0">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex">
            <a (click)="setActiveTab('discussions')" 
               [ngClass]="{'border-orange-600 text-orange-600': activeTab === 'discussions', 'border-transparent text-gray-500': activeTab !== 'discussions'}"
               class="py-4 px-6 font-medium border-b-2 hover:text-gray-700 transition-colors cursor-pointer">Discussions</a>
            <a (click)="setActiveTab('groups')" 
               [ngClass]="{'border-orange-600 text-orange-600': activeTab === 'groups', 'border-transparent text-gray-500': activeTab !== 'groups'}"
               class="py-4 px-6 font-medium border-b-2 hover:text-gray-700 transition-colors cursor-pointer">Local Groups</a>
            <a (click)="setActiveTab('members')" 
               [ngClass]="{'border-orange-600 text-orange-600': activeTab === 'members', 'border-transparent text-gray-500': activeTab !== 'members'}"
               class="py-4 px-6 font-medium border-b-2 hover:text-gray-700 transition-colors cursor-pointer">Members</a>
          </div>
        </div>
      </nav>

      <!-- Main Content Area based on active tab -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4">

          <!-- Discussions Tab Content -->
          <div *ngIf="activeTab === 'discussions'" class="discussions-content">
            <div class="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
              <div class="relative w-full sm:max-w-sm">
                <input type="text" placeholder="Search discussions..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
                </svg>
              </div>
              <button routerLink="/community/discussion/new" class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-1 transition-colors w-full sm:w-auto">
                <span class="text-lg">+</span> New Discussion
              </button>
            </div>
            
            <p class="text-sm font-semibold text-black-700 mb-4">Trending Topics</p>
            <div class="flex flex-wrap gap-2 mb-8">
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#diwali2024</span>
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#vegetarian-recipes</span>
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#sanskrit-learning</span>
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#temple-events</span>
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#yoga-classes</span>
              <span class="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">#cultural-programs</span>
            </div>

            <!-- Discussion Thread Card -->
            <div *ngFor="let discussion of discussions" class="bg-white rounded-xl shadow p-6 mb-4">
              <h3 class="font-semibold text-lg mb-1">{{ discussion.title }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ discussion.content }}</p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span *ngFor="let tag of discussion.tags" class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-md">#{{ tag }}</span>
                <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">{{ discussion.category }}</span>
              </div>

              <div class="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full mr-2 bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs">
                    {{ discussion.authorName ? discussion.authorName.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <span>{{ discussion.authorName }}</span>
                </div>
                <div *ngIf="discussion.cityName" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{{ discussion.cityName }}</span>
                </div>
                <span>{{ formatDate(discussion.createdAt) }}</span>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="discussions.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
              <p class="text-gray-500">No discussions found.</p>
            </div>
          </div>

          <!-- Local Groups Tab Content -->
          <div *ngIf="activeTab === 'groups'" class="local-groups-content">
            <div class="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
              <div class="relative w-full sm:max-w-sm">
                <input type="text" placeholder="Search groups..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
                </svg>
              </div>
              <button class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-1 transition-colors w-full sm:w-auto">
                <span class="text-lg">+</span> Create Group
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Group Card 1 -->
              <div class="bg-white rounded-xl shadow p-6 flex items-start relative gap-4">
                <svg class="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
                </svg>
                <div class="flex-grow">
                  <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Family</span>
                  <h3 class="font-semibold text-lg mb-2">Auckland Hindu Families</h3>
                  <p class="text-sm text-gray-500 mb-4">Connect with Hindu families in Auckland for playdates, cultural events, and community support.</p>
                  <button class="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 mt-auto transition-colors">Join Group</button>
                </div>
              </div>
              <!-- Add more cards as needed -->
            </div>
          </div>

          <!-- Members Tab Content -->
          <div *ngIf="activeTab === 'members'" class="members-content">
            <div class="flex flex-col items-center text-center py-20">
              <svg class="w-24 h-24 text-gray-300 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
              </svg>
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">Member Directory</h2>
              <p class="text-black-700 mb-8 max-w-sm">Connect with fellow community members across New Zealand</p>
              <button class="bg-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-orange-700 transition-colors">Coming Soon</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class CommunityComponent implements OnInit {
  private http = inject(HttpClient);
  activeTab: 'discussions' | 'groups' | 'members' = 'discussions';
  discussions: any[] = [];

  ngOnInit() {
    this.loadDiscussions();
  }

  loadDiscussions() {
    this.http.get<any>(`${environment.apiBaseUrl}/public/community/discussions`).subscribe({
      next: (res) => {
        if (res.data) {
          this.discussions = res.data;
        }
      },
      error: (err) => console.error('Failed to load discussions', err)
    });
  }

  setActiveTab(tab: 'discussions' | 'groups' | 'members') {
    this.activeTab = tab;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
}
