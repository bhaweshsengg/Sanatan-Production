import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface PanchangData {
  date: string;
  day: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  vedicTime: string;
  currentPeriod: {
    name: string;
    type: 'Good' | 'Bad' | 'Neutral';
    description: string;
  };
}

interface Sloka {
  text: string;
  translation: string;
  source: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <!-- Navigation (unchanged) -->
      <nav aria-label="Main" data-orientation="horizontal" dir="ltr" class="relative z-10 flex max-w-max flex-1 items-center justify-center">
        <div style="position: relative;">
          <ul data-orientation="horizontal" class="group flex flex-1 list-none items-center justify-center space-x-1" dir="ltr">
            <li><a class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" href="/" data-radix-collection-item="">Home</a></li>
            <li><a class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" href="/about" data-radix-collection-item="">About</a></li>
            <li><a class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" href="/help" data-radix-collection-item="">Help</a></li>
            <li><a class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" routerLink="/business/admin/business-submissions" data-radix-collection-item="">Admin</a></li>
          </ul>
        </div>
        <div class="absolute left-0 top-full flex justify-center"></div>
      </nav>
      
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">नमस्ते! Welcome to Sanatan New Zealand 🙏</h1>
              <p class="text-black-700 mt-1">Connecting the Hindu community across New Zealand</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">Today's Tithi</div>
              <div class="font-semibold text-amber-700">{{ panchang.tithi }}</div>
            </div>
          </div>
          
          <!-- Dynamic Sloka Section -->
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div class="p-4">
              <div class="text-center">
                <p class="text-lg font-semibold text-amber-800 mb-2">{{ dailySloka.text }}</p>
                <p class="text-gray-700 mb-1">{{ dailySloka.translation }}</p>
                <p class="text-sm text-amber-600">— {{ dailySloka.source }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rest of the dashboard content remains the same -->
        <!-- ... -->
        
        <!-- Dynamic Panchang Section -->
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 h-8 w-8 text-orange-500 mx-auto mb-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">50+</div>
                  <div class="text-sm text-black-700">Hindu Temples</div>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-8 w-8 text-green-500 mx-auto mb-2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">200+</div>
                  <div class="text-sm text-black-700">Monthly Events</div>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle h-8 w-8 text-blue-500 mx-auto mb-2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">5000+</div>
                  <div class="text-sm text-black-700">Community Members</div>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame h-8 w-8 text-red-500 mx-auto mb-2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">Daily</div>
                  <div class="text-sm text-black-700">Puja Services</div>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-8 w-8 text-purple-500 mx-auto mb-2"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">100+</div>
                  <div class="text-sm text-black-700">Study Groups</div>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div class="p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-8 w-8 text-pink-500 mx-auto mb-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  <div class="text-2xl font-bold text-gray-900">24/7</div>
                  <div class="text-sm text-black-700">Spiritual Support</div>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
                  <span>Explore Our Community</span>
                </div>
                <div class="text-sm text-muted-foreground">Discover temples, events, and spiritual resources</div>
              </div>
              <div class="p-6 pt-0">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground px-4 py-2 h-20 flex-col bg-orange-600 hover:bg-orange-700" href="/events/create">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus h-6 w-6 mb-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <span class="text-sm">Create Event</span>
                  </a>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex-col" href="/temples">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 h-6 w-6 mb-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                    <span class="text-sm">Find Mandirs</span>
                  </a>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex-col" href="/community">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle h-6 w-6 mb-2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                    <span class="text-sm">Join Discussions</span>
                  </a>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex-col" href="/business/directory">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 h-6 w-6 mb-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                    <span class="text-sm">Hindu Businesses</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
                  <span>Upcoming Spiritual Events</span>
                  <a class="text-sm text-orange-600 hover:underline" href="/events">View all</a>
                </div>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="Janmashtami Celebration" loading="lazy" width="60" height="60" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/60x60/FFD700/000000?text=Krishna" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Janmashtami Celebration</h4>
                    <p class="text-sm text-black-700">Shri Krishna Mandir</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-3 w-3 mr-1"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>Aug 26</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>18:00</span>
                      <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">Festival</div>
                    </div>
                  </div>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" href="/events/1">View</a>
                </div>
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="Ganesha Chaturthi Puja" loading="lazy" width="60" height="60" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/60x60/FF4500/FFFFFF?text=Ganesha" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Ganesha Chaturthi Puja</h4>
                    <p class="text-sm text-black-700">Ganesh Temple Auckland</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-3 w-3 mr-1"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>Sep 7</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>10:00</span>
                      <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">Puja</div>
                    </div>
                  </div>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" href="/events/2">View</a>
                </div>
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="Bhagavad Gita Study Circle" loading="lazy" width="60" height="60" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/60x60/8B4513/FFFFFF?text=Gita" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Bhagavad Gita Study Circle</h4>
                    <p class="text-sm text-black-700">Sanatan Dharm Mandir</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-3 w-3 mr-1"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>Aug 20</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>19:00</span>
                      <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 text-foreground text-xs">Satsang</div>
                    </div>
                  </div>
                  <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" href="/events/3">View</a>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="text-2xl font-semibold leading-none tracking-tight">Featured Mandirs</div>
                <div class="text-sm text-muted-foreground">Discover beautiful temples across New Zealand</div>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="ISKCON Auckland" loading="lazy" width="80" height="80" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/80x80/FFA500/FFFFFF?text=ISKCON" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">ISKCON Auckland</h4>
                    <p class="text-sm text-black-700">Dedicated to Krishna</p>
                    <p class="text-sm text-amber-600">Daily Bhagavatam classes</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-3 w-3 mr-1"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>5.2 km</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3 w-3 mr-1 text-yellow-500"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>4.9</span>
                    </div>
                  </div>
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Visit</button>
                </div>
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="Shiva Vishnu Temple" loading="lazy" width="80" height="80" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/80x80/0000FF/FFFFFF?text=Shiva" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Shiva Vishnu Temple</h4>
                    <p class="text-sm text-black-700">Dedicated to Shiva &amp; Vishnu</p>
                    <p class="text-sm text-amber-600">Monday Shiva Abhishek</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-3 w-3 mr-1"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>8.1 km</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3 w-3 mr-1 text-yellow-500"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>4.7</span>
                    </div>
                  </div>
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Visit</button>
                </div>
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img alt="Durga Mata Mandir" loading="lazy" width="80" height="80" decoding="async" data-nimg="1" class="rounded-lg object-cover" src="https://placehold.co/80x80/800000/FFFFFF?text=Durga" style="color: transparent;">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Durga Mata Mandir</h4>
                    <p class="text-sm text-black-700">Dedicated to Durga</p>
                    <p class="text-sm text-amber-600">Navratri celebrations</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-3 w-3 mr-1"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>12.3 km</span>
                      <span class="text-sm text-gray-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3 w-3 mr-1 text-yellow-500"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>4.8</span>
                    </div>
                  </div>
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Visit</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="max-w-sm">
              <div class="rounded-lg bg-card text-card-foreground w-full max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-amber-50">
                <div class="p-0">
                  <div class="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-lg">
                    <div class="flex items-center justify-between">
                      <div>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-6 w-6"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          सनातन पंचांग
                        </h2>
                        <p class="text-amber-100 mt-1">{{ currentDate }}, {{ panchang.day }}</p>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center gap-1 text-amber-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <span class="text-sm">Auckland, NZ</span>
                        </div>
                        <div class="text-sm text-amber-100 mt-1">शुक्ल पक्ष, ज्येष्ठ 1947 शक</div>
                      </div>
                    </div>
                  </div>
                  <div class="p-6 pb-0">
                    <div class="flex flex-wrap gap-2 mb-6">
                      <button 
                        *ngFor="let tab of panchangTabs" 
                        (click)="activeTab = tab.id"
                        [class]="activeTab === tab.id ? 
                          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-amber-500 hover:bg-amber-600' : 
                          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'">
                        {{ tab.label }}
                      </button>
                    </div>
                  </div>
                  <div class="p-6 pt-0">
                    <div class="space-y-6">
                      <div class="text-center space-y-4">
                        <div class="relative">
                          <div class="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{{ currentTime }}</div>
                          <div class="text-sm text-amber-700 font-medium mt-1">NZ Standard Time</div>
                        </div>
                        <div class="flex items-center justify-center gap-4">
                          <div class="text-2xl font-mono text-gray-700">{{ panchang.vedicTime }}</div>
                          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 text-foreground text-xs">{{ panchang.day }}</div>
                        </div>
                      </div>
                      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                        <div class="flex items-center justify-between">
                          <div>
                            <h3 class="font-semibold text-amber-800">वर्तमान काल</h3>
                            <p class="text-2xl font-bold" 
                               [class.text-amber-900]="panchang.currentPeriod.type === 'Good'"
                               [class.text-red-600]="panchang.currentPeriod.type === 'Bad'"
                               [class.text-gray-700]="panchang.currentPeriod.type === 'Neutral'">
                              {{ panchang.currentPeriod.name }}
                            </p>
                            <p class="text-sm text-amber-700 mt-1">{{ panchang.currentPeriod.description }}</p>
                          </div>
                          <div class="w-12 h-12" 
                               [class.bg-amber-500]="panchang.currentPeriod.type === 'Good'"
                               [class.bg-red-500]="panchang.currentPeriod.type === 'Bad'"
                               [class.bg-gray-500]="panchang.currentPeriod.type === 'Neutral'"
                               class="rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-6 w-6 text-white"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          </div>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div class="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-4 w-4 text-orange-500"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                            <span class="text-sm text-black-700">सूर्योदय</span>
                          </div>
                          <div class="font-semibold text-orange-600">{{ panchang.sunrise }}</div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div class="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-4 w-4 text-blue-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                            <span class="text-sm text-black-700">सूर्यास्त</span>
                          </div>
                          <div class="font-semibold text-blue-600">{{ panchang.sunset }}</div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div class="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-4 w-4 text-purple-500"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                            <span class="text-sm text-black-700">तिथि</span>
                          </div>
                          <div class="font-semibold text-purple-600">{{ panchang.tithi }}</div>
                        </div>
                        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div class="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 text-green-500"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span class="text-sm text-black-700">नक्षत्र</span>
                          </div>
                          <div class="font-semibold text-green-600">{{ panchang.nakshatra }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Location Settings -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 class="font-semibold mb-3">Location Settings</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Select City</label>
                  <select 
                    [(ngModel)]="selectedCity" 
                    (change)="updatePanchangForLocation()"
                    class="w-full p-2 border rounded-md focus:ring-amber-500 focus:border-amber-500">
                    <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                  <div class="text-sm text-black-700 p-2 bg-gray-50 rounded-md">
                    {{ timeZone }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  currentTime: string = '';
  timeZone: string = 'Pacific/Auckland';
  selectedCity: string = 'Auckland';
  cities: string[] = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'];
  activeTab: string = 'general';
  
  panchangTabs = [
    { id: 'general', label: 'सामान्य जानकारी' },
    { id: 'muhurta', label: 'मुहूर्त' },
    { id: 'chaughadia', label: 'चौघड़िया' },
    { id: 'clock', label: 'दृश्य घड़ी' }
  ];

  dailySloka: Sloka = {
    text: '',
    translation: '',
    source: ''
  };

  panchang: PanchangData = {
    date: '',
    day: '',
    tithi: '',
    nakshatra: '',
    yoga: '',
    karana: '',
    sunrise: '',
    sunset: '',
    vedicTime: '',
    currentPeriod: {
      name: '',
      type: 'Neutral',
      description: ''
    }
  };

  private slokas: Sloka[] = [
    {
      text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      translation: 'You have the right to perform your actions, but never to the fruits of action.',
      source: 'Bhagavad Gita 2.47'
    },
    {
      text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत',
      translation: 'Whenever there is a decline in righteousness, O Bharata',
      source: 'Bhagavad Gita 4.7'
    },
    {
      text: 'विद्या विनयेन शोभते',
      translation: 'Knowledge shines with humility',
      source: 'Subhashita'
    },
    {
      text: 'अहिंसा परमो धर्मः',
      translation: 'Non-violence is the ultimate duty',
      source: 'Mahabharata'
    }
  ];

  private timer: any;

  ngOnInit() {
    this.updateDateTime();
    this.updateDailySloka();
    this.updatePanchangData();
    
    // Update time every second
    this.timer = setInterval(() => {
      this.updateDateTime();
      this.updatePanchangData();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-NZ', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    this.currentTime = now.toLocaleTimeString('en-NZ', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  updateDailySloka() {
    // Change sloka based on day of the year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const slokaIndex = dayOfYear % this.slokas.length;
    this.dailySloka = this.slokas[slokaIndex];
  }

  updatePanchangData() {
    // This would typically come from an API or calculation library
    // For demo purposes, we're using mock data that changes based on time
    
    const now = new Date();
    const hours = now.getHours();
    
    // Determine current period based on time of day
    let periodName = '';
    let periodType: 'Good' | 'Bad' | 'Neutral' = 'Neutral';
    let periodDescription = '';
    
    if (hours >= 5 && hours < 7) {
      periodName = 'Brahma Muhurta';
      periodType = 'Good';
      periodDescription = 'Ideal for meditation and spiritual practices';
    } else if (hours >= 7 && hours < 9) {
      periodName = 'Pratahkal';
      periodType = 'Good';
      periodDescription = 'Good for starting new activities';
    } else if (hours >= 9 && hours < 12) {
      periodName = 'Madhyahna';
      periodType = 'Neutral';
      periodDescription = 'Neutral period for routine work';
    } else if (hours >= 12 && hours < 15) {
      periodName = 'Aprahna';
      periodType = 'Bad';
      periodDescription = 'Not ideal for important decisions';
    } else if (hours >= 15 && hours < 18) {
      periodName = 'Sayankal';
      periodType = 'Good';
      periodDescription = 'Good for creative work';
    } else if (hours >= 18 && hours < 20) {
      periodName = 'Pradosha';
      periodType = 'Neutral';
      periodDescription = 'Moderate period for activities';
    } else {
      periodName = 'Nishita';
      periodType = 'Bad';
      periodDescription = 'Rest period, not ideal for new ventures';
    }
    
    // Mock panchang data - in a real app, this would come from calculations or API
    this.panchang = {
      date: now.toLocaleDateString('hi-IN'),
      day: now.toLocaleDateString('hi-IN', { weekday: 'long' }),
      tithi: this.calculateTithi(now),
      nakshatra: this.calculateNakshatra(now),
      yoga: 'Siddhi',
      karana: 'Bava',
      sunrise: '6:30 AM',
      sunset: '7:15 PM',
      vedicTime: this.calculateVedicTime(now),
      currentPeriod: {
        name: periodName,
        type: periodType,
        description: periodDescription
      }
    };
  }

  updatePanchangForLocation() {
    // In a real application, this would fetch location-specific panchang data
    // For now, we'll just update the timezone based on the selected city
    if (this.selectedCity === 'Auckland') {
      this.timeZone = 'Pacific/Auckland';
    } else if (this.selectedCity === 'Wellington') {
      this.timeZone = 'Pacific/Auckland';
    } else if (this.selectedCity === 'Christchurch') {
      this.timeZone = 'Pacific/Auckland';
    } else if (this.selectedCity === 'Hamilton') {
      this.timeZone = 'Pacific/Auckland';
    }
    
    this.updatePanchangData();
  }

  // These functions would contain actual astronomical calculations in a real app
  private calculateTithi(date: Date): string {
    const tithis = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 
                   'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 
                   'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'];
    const day = date.getDate();
    return tithis[day % 30];
  }

  private calculateNakshatra(date: Date): string {
    const nakshatras = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 
                       'पूर्व फाल्गुनी', 'उत्तर फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 
                       'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्व भाद्रपद', 'उत्तर भाद्रपद', 'रेवती'];
    const day = date.getDate();
    return nakshatras[day % 27];
  }

  private calculateVedicTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Convert to Indian time (for demonstration)
    const indianHours = (hours + 7) % 24;
    
    // Simple conversion to Vedic time (ghati, pala, vipala)
    const totalSeconds = indianHours * 3600 + minutes * 60 + seconds;
    const ghati = Math.floor(totalSeconds / 1440);
    const remainingSeconds = totalSeconds % 1440;
    const pala = Math.floor(remainingSeconds / 24);
    const vipala = Math.floor(remainingSeconds % 24);
    
    return `${ghati}:${pala}:${vipala}`;
  }
}