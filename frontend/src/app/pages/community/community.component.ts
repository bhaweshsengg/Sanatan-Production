import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";

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
          <div routerLink="/community/discussion/new" class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button class="bg-white text-orange-600 font-medium px-6 py-2 rounded-md hover:bg-gray-50 shadow-md flex items-center gap-2 transition-colors">
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
              <button  routerLink="/community/discussion/new" class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-1 transition-colors w-full sm:w-auto">
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
            <div class="bg-white rounded-xl shadow p-6 mb-4">
              <h3 class="font-semibold text-lg mb-1">Best places for vegetarian food in Auckland?</h3>
              <p class="text-sm text-gray-500 mb-4">Looking for authentic vegetarian restaurants that serve good Indian food. Any recommendations?</p>
              <div class="flex items-center text-sm text-gray-500">
                <div class="flex items-center mr-4">
                  <img class="w-6 h-6 rounded-full mr-2" src="https://via.placeholder.com/150" alt="Priya Sharma">
                  <span>Priya Sharma</span>
                </div>
                <span class="mr-4">Auckland</span>
                <span>2 hours ago</span>
              </div>
            </div>

            <!-- Another Discussion Thread Card -->
            <div class="bg-white rounded-xl shadow p-6 mb-4">
              <h3 class="font-semibold text-lg mb-1">Organizing Karva Chauth celebration in Wellington</h3>
              <p class="text-sm text-gray-500 mb-4">Planning a community Karva Chauth celebration. Looking for volunteers and venue suggestions.</p>
              <div class="flex items-center text-sm text-gray-500">
                <div class="flex items-center mr-4">
                  <img class="w-6 h-6 rounded-full mr-2" src="https://via.placeholder.com/150" alt="Meera Patel">
                  <span>Meera Patel</span>
                </div>
                <span class="mr-4">Wellington</span>
                <span>4 hours ago</span>
              </div>
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
                <!-- SVG Icon for the group card -->
                <svg class="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
                </svg>
                <div class="flex-grow">
                  <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Family</span>
                  <h3 class="font-semibold text-lg mb-2">Auckland Hindu Families</h3>
                  <p class="text-sm text-gray-500 mb-4">Connect with Hindu families in Auckland for playdates, cultural events, and community support.</p>
                  <div class="text-sm text-black-700 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM16 13c-2.652 0-3.056 1.144-5 1.701v4.299c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3v-4.299c-1.944-.557-2.348-1.701-5-1.701zM10 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM10 10c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V14h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51zM4 14.5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 16.5c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V20h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51z"/></svg>
                    <span>245 members · Auckland</span>
                  </div>
                  <button class="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 mt-auto transition-colors">Join Group</button>
                </div>
              </div>
              <!-- Group Card 2 -->
              <div class="bg-white rounded-xl shadow p-6 flex items-start relative gap-4">
                <svg class="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
                </svg>
                <div class="flex-grow">
                  <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Professional</span>
                  <h3 class="font-semibold text-lg mb-2">Wellington Young Professionals</h3>
                  <p class="text-sm text-gray-500 mb-4">Networking and social group for young Hindu professionals in the capital.</p>
                  <div class="text-sm text-black-700 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM16 13c-2.652 0-3.056 1.144-5 1.701v4.299c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3v-4.299c-1.944-.557-2.348-1.701-5-1.701zM10 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM10 10c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V14h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51zM4 14.5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 16.5c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V20h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51z"/></svg>
                    <span>89 members · Wellington</span>
                  </div>
                  <button class="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 mt-auto transition-colors">Join Group</button>
                </div>
              </div>
              <!-- Group Card 3 -->
              <div class="bg-white rounded-xl shadow p-6 flex items-start relative gap-4">
                <svg class="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
                </svg>
                <div class="flex-grow">
                  <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Cultural</span>
                  <h3 class="font-semibold text-lg mb-2">Christchurch Cultural Society</h3>
                  <p class="text-sm text-gray-500 mb-4">Preserving and celebrating Hindu culture through events, workshops, and festivals.</p>
                  <div class="text-sm text-black-700 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM16 13c-2.652 0-3.056 1.144-5 1.701v4.299c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3v-4.299c-1.944-.557-2.348-1.701-5-1.701zM10 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM10 10c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V14h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51zM4 14.5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 16.5c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V20h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51z"/></svg>
                    <span>156 members · Christchurch</span>
                  </div>
                  <button class="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 mt-auto transition-colors">Join Group</button>
                </div>
              </div>
              <!-- Group Card 4 -->
              <div class="bg-white rounded-xl shadow p-6 flex items-start relative gap-4">
                <svg class="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 3a3 3 0 11-3 3 3 3 0 013-3m0 14.2a6 6 0 01-5-2.2c-.2-.2-.5-.4-.5-.7v-1.3c0-.3.2-.6.5-.7a6.2 6.2 0 0110 0c.3.1.5.4.5.7v1.3c0 .3-.2.5-.5.7a6 6 0 01-5 2.2z"/>
                </svg>
                <div class="flex-grow">
                  <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Spiritual</span>
                  <h3 class="font-semibold text-lg mb-2">Hamilton Bhajan Group</h3>
                  <p class="text-sm text-gray-500 mb-4">Weekly bhajan sessions and spiritual discussions for devotees in Hamilton.</p>
                  <div class="text-sm text-black-700 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM16 13c-2.652 0-3.056 1.144-5 1.701v4.299c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3v-4.299c-1.944-.557-2.348-1.701-5-1.701zM10 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM10 10c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V14h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51zM4 14.5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 16.5c-1.42 0-2.43 1.077-3.793 2.51l-.207.245V20h8v-1.245c-1.363-1.433-2.373-2.51-3.793-2.51z"/></svg>
                    <span>67 members · Hamilton</span>
                  </div>
                  <button class="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 mt-auto transition-colors">Join Group</button>
                </div>
              </div>
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
export class CommunityComponent {
  activeTab: 'discussions' | 'groups' | 'members' = 'discussions';

  setActiveTab(tab: 'discussions' | 'groups' | 'members') {
    this.activeTab = tab;
  }
}
