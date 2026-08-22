import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define the data structure for a festival
interface Festival {
  id: number;
  name: string;
  date: string;
  significance: string;
  rituals: string[];
  deities: string[];
  category: 'Major Festival' | 'Religious Observance';
  location?: string;
}

@Component({
  selector: 'app-festival',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Gradient Header -->
      <header class="bg-gradient-to-r from-orange-600 to-red-700 py-16 text-white">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">Sanatan Festivals in New Zealand</h1>
          <p class="text-lg text-orange-100 mb-8">
            Explore the rich calendar of Sanatan festivals celebrated across Aotearoa
          </p>
<div class="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-4xl mx-auto">
            <div class="relative flex-grow">
              <input type="text" placeholder="Search festivals..."
                class="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                (input)="onSearch($event)">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
              </svg>
            </div>
            <div class="relative w-full sm:w-auto">
              <select class="block w-full px-4 py-2 pr-8 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      [(ngModel)]="selectedCategory" (change)="filterFestivals()">
                <option value="All">All Categories</option>
                <option value="Major Festival">Major Festival</option>
                <option value="Religious Observance">Religious Observance</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Results Count -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-gray-700">{{ filteredFestivals.length }} Festivals Found</h2>
          </div>

          <!-- Festival Cards Grid -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let festival of filteredFestivals" class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <!-- Image Placeholder -->
              <div class="relative w-full aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-400">
                <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path></svg>
                <span class="absolute top-4 right-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{{ festival.category }}</span>
              </div>
              
              <div class="p-6">
                <h3 class="font-bold text-lg mb-1">{{ festival.name }}</h3>
                <p class="text-sm text-gray-500 mb-4">{{ festival.date }}</p>
                <hr class="border-gray-200 mb-4">
                <h4 class="font-semibold text-gray-700 text-sm mb-1">Significance:</h4>
                <p class="text-sm text-black-700 mb-4">{{ festival.significance }}</p>
                <h4 class="font-semibold text-gray-700 text-sm mb-1">Key Rituals:</h4>
                <ul class="list-disc list-inside text-sm text-black-700 mb-4 ml-4 space-y-1">
                  <li *ngFor="let ritual of festival.rituals">{{ ritual }}</li>
                </ul>
                <h4 class="font-semibold text-gray-700 text-sm mb-1">Associated Deities:</h4>
                <div class="flex flex-wrap gap-2 text-sm">
                  <span *ngFor="let deity of festival.deities" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{{ deity }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="p-6 pt-0 flex justify-end gap-2 border-t border-gray-100 mt-4">
                <button class="bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                  Learn More
                </button>
                <button class="bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Find Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class FestivalComponent implements OnInit {
  festivals: Festival[] = [
    {
      id: 1,
      name: 'Diwali',
      date: '12 November 2024',
      significance: 'The five-day festival of lights, celebrated by Sanatan, Jains, Sikhs, and some Buddhists.',
      rituals: ['Lighting of diyas and candles', 'Worshiping goddess Lakshmi', 'Exchanging sweets and gifts', 'Wearing new clothes', 'Family gatherings and feasts'],
      deities: ['Goddess Lakshmi', 'Lord Ganesha', 'Lord Rama'],
      category: 'Major Festival',
    },
    {
      id: 2,
      name: 'Holi',
      date: '14 March 2025',
      significance: 'The festival of colors, celebrating the arrival of spring and the triumph of good over evil.',
      rituals: ['Bonfires and eternal and divine love of Radha Krishna', 'Playing with colors'],
      deities: ['Lord Krishna', 'Radha'],
      category: 'Major Festival',
    },
    {
      id: 3,
      name: 'Navratri',
      date: '3 October 2024',
      significance: 'A nine-night festival dedicated to the worship of the Goddess Durga.',
      rituals: ['Fasting and prayers', 'Dandiya and Garba dances', 'Worship of the nine forms of Durga'],
      deities: ['Goddess Durga', 'Goddess Lakshmi', 'Goddess Saraswati'],
      category: 'Major Festival',
    },
    {
      id: 4,
      name: 'Maha Shivaratri',
      date: '28 February 2025',
      significance: 'The Great Night of Shiva, celebrating the convergence of Shiva and Shakti.',
      rituals: ['Observing a strict fast', 'Offering fruits and flowers', 'Singing bhajan and kirtan', 'Performing Lingam Puja with milk, water, and bilva leaves'],
      deities: ['Lord Shiva', 'Goddess Parvati'],
      category: 'Religious Observance',
    },
    {
      id: 5,
      name: 'Janmashtami',
      date: '19 August 2024',
      significance: 'Celebrating the birth of Lord Krishna, the eighth incarnation of Lord Vishnu.',
      rituals: ['Fasting until midnight', 'Decorating temples and homes', 'Singing bhajans and kirtans', 'Performing a ritual bath (abhishek) of Krishna idol'],
      deities: ['Lord Krishna', 'Radha'],
      category: 'Religious Observance',
    },
    {
      id: 6,
      name: 'Ganesh Chaturthi',
      date: '7 September 2024',
      significance: 'Celebrating the birth of Lord Ganesha, the god of wisdom, prosperity, and good fortune.',
      rituals: ['Installation of Ganesha idols', 'Offerings of modak', 'Chanting mantras', 'Immersion of idols (Visarjan) on the last day'],
      deities: ['Lord Ganesha'],
      category: 'Religious Observance',
    }
  ];

  filteredFestivals: Festival[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';

  ngOnInit() {
    this.filterFestivals();
  }
  
  // This method is called whenever the search input or category dropdown changes
  filterFestivals() {
    this.filteredFestivals = this.festivals.filter(festival => {
      const categoryMatch = this.selectedCategory === 'All' || festival.category === this.selectedCategory;
      const searchMatch = festival.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          festival.significance.toLowerCase().includes(this.searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }

  // Update filtered festivals when search input changes
  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterFestivals();
  }
}