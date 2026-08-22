import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Subscription, interval } from 'rxjs';

// Interface for Muhurat data
interface Muhurat {
  name: string;
  time: string;
  end: string;
  significance: string;
  type: 'शुभ' | 'अशुभ' | 'सक्रिय';
}

// Interface for Choghadiya data
interface Choghadiya {
  name: string;
  time: string;
  end: string;
  significance: string;
  type: 'शुभ' | 'अशुभ' | 'सक्रिय';
}

@Component({
  selector: 'app-dateandtime',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  template: `
    <div class="p-6 md:p-10 lg:p-16 min-h-screen bg-white font-sans text-gray-800">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-1">Sanatan Time & Calendar</h1>
        <p class="text-black-700 mb-8">
          Explore the current Sanatan time and calendar information.
        </p>
        
        <!-- Main Panchanag Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-orange-500 to-amber-400 p-6 flex flex-col sm:flex-row items-center justify-between text-white">
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 class="text-xl md:text-2xl font-bold">सनातन पंचांग</h2>
                <p class="text-sm md:text-base">{{ currentDate | date:'d MMMM y' }}, {{ currentDay }}</p>
              </div>
            </div>
            <div class="mt-4 sm:mt-0 text-center sm:text-right">
              <p class="text-base md:text-lg font-semibold">{{ location }}</p>
              <p class="text-sm">{{ paksha }}, {{ masa }} {{ samvat }} शक</p>
            </div>
          </div>
          
          <div class="p-6 md:p-8">
            <!-- Panchanag Tabs -->
            <div class="flex flex-wrap gap-2 mb-6">
              <button (click)="selectedTab = 'general'" [ngClass]="{'bg-orange-600 text-white': selectedTab === 'general', 'bg-gray-200 text-gray-800': selectedTab !== 'general'}"
                      class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">सामान्य जानकारी</button>
              <button (click)="selectedTab = 'muhurat'" [ngClass]="{'bg-orange-600 text-white': selectedTab === 'muhurat', 'bg-gray-200 text-gray-800': selectedTab !== 'muhurat'}"
                      class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">मुहूर्त</button>
              <button (click)="selectedTab = 'choghadiya'" [ngClass]="{'bg-orange-600 text-white': selectedTab === 'choghadiya', 'bg-gray-200 text-gray-800': selectedTab !== 'choghadiya'}"
                      class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">चौघड़िया</button>
              <button (click)="selectedTab = 'dashpahari'" [ngClass]="{'bg-orange-600 text-white': selectedTab === 'dashpahari', 'bg-gray-200 text-gray-800': selectedTab !== 'dashpahari'}"
                      class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">दश पहरी</button>
            </div>

            <!-- Tab Content based on selectedTab -->
            <ng-container *ngIf="selectedTab === 'general'">
              <!-- Time Display -->
              <div class="text-center mb-8">
                <div class="flex justify-center items-baseline">
                  <p class="text-5xl md:text-7xl font-light text-orange-600 tracking-wider">
                    {{ countdownTime }}
                  </p>
                </div>
                <p class="text-xs md:text-sm text-gray-500 mt-2">परी: पध, मिनट</p>
                <p class="text-2xl md:text-4xl font-normal text-gray-700 mt-2">{{ currentTime }} {{ currentDay }}</p>
              </div>

              <!-- Shubh Kal -->
              <div class="bg-gray-100 p-4 rounded-xl flex items-center justify-between mb-8">
                <div>
                  <p class="text-sm text-gray-500 font-semibold">वर्तमान काल</p>
                  <h3 class="text-xl font-bold mt-1">शुभ काल</h3>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>

              <!-- Detailed Information -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-gray-100 p-4 rounded-xl text-center">
                  <p class="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    सूर्योदय
                  </p>
                  <p class="text-base font-semibold">{{ sunriseTime }}</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-xl text-center">
                  <p class="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    सूर्यास्त
                  </p>
                  <p class="text-base font-semibold">{{ sunsetTime }}</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-xl text-center">
                  <p class="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    तिथि
                  </p>
                  <p class="text-base font-semibold">{{ tithi }}</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-xl text-center">
                  <p class="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M5 3s4 0 4 5c0 1.5-1 2-2 3s-2 1-2 3c0 1.5 1 2 2 3s2 1 2 3c0 1.5-1 2-2 3s-2 1-2 3c0 1.5 1 2 2 3s2 1 2 3" />
                    </svg>
                    नक्षत्र
                  </p>
                  <p class="text-base font-semibold">{{ nakshatra }}</p>
                </div>
              </div>

              <hr class="border-gray-200 mb-4">
              
              <div class="flex flex-col sm:flex-row items-center justify-between text-sm text-black-700 mb-4">
                <span>दिन की अवधि: {{ dayDuration }}</span>
                <span>रात्रि की अवधि: {{ nightDuration }}</span>
                <button class="bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition-colors mt-4 sm:mt-0">
                  परी रात Converter
                </button>
              </div>
            </ng-container>

            <!-- Muhurat Tab Content -->
            <ng-container *ngIf="selectedTab === 'muhurat'">
              <h3 class="text-2xl font-bold mb-6">आज के मुहूर्त</h3>
              <div class="space-y-4">
                <div *ngFor="let muhurat of muhurats" [ngClass]="{'bg-orange-100': muhurat.type === 'सक्रिय', 'bg-gray-100': muhurat.type !== 'सक्रिय'}" class="p-4 rounded-lg flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="text-lg font-semibold">{{ muhurat.name }}</h4>
                      <span *ngIf="muhurat.type === 'सक्रिय'" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500 text-white">सक्रिय</span>
                    </div>
                    <p class="text-sm text-black-700">{{ muhurat.significance }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">{{ muhurat.time }} - {{ muhurat.end }}</p>
                    <span [ngClass]="{'text-green-600': muhurat.type === 'शुभ', 'text-red-600': muhurat.type === 'अशुभ', 'text-orange-600': muhurat.type === 'सक्रिय'}" class="text-xs font-semibold">{{ muhurat.type }}</span>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- Choghadiya Tab Content -->
            <ng-container *ngIf="selectedTab === 'choghadiya'">
              <h3 class="text-2xl font-bold mb-6">आज के चौघड़िया</h3>
              <div class="space-y-4">
                <div *ngFor="let choghadiya of choghadiyas" class="p-4 rounded-lg flex items-start justify-between" [ngClass]="{'bg-green-100': choghadiya.type === 'शुभ' || choghadiya.type === 'सक्रिय', 'bg-red-100': choghadiya.type === 'अशुभ'}">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="text-lg font-semibold">{{ choghadiya.name }}</h4>
                      <span *ngIf="choghadiya.type === 'सक्रिय'" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500 text-white">सक्रिय</span>
                    </div>
                    <p class="text-sm text-black-700">{{ choghadiya.significance }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">{{ choghadiya.time }} - {{ choghadiya.end }}</p>
                    <span [ngClass]="{'text-green-600': choghadiya.type === 'शुभ' || choghadiya.type === 'सक्रिय', 'text-red-600': choghadiya.type === 'अशुभ'}" class="text-xs font-semibold">{{ choghadiya.type }}</span>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- Dash Pahari Tab Content - Placeholder -->
            <ng-container *ngIf="selectedTab === 'dashpahari'">
              <p class="text-gray-500 text-center py-8">दश पहरी जानकारी जल्द ही उपलब्ध होगी।</p>
            </ng-container>

            <hr class="border-gray-200 mt-8 mb-4">
            
            <div class="flex flex-col sm:flex-row items-center justify-between text-sm text-black-700 mb-4">
              <span>दिन की अवधि: {{ dayDuration }}</span>
              <span>रात्रि की अवधि: {{ nightDuration }}</span>
              <button class="bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition-colors mt-4 sm:mt-0">
                परी रात Converter
              </button>
            </div>
          </div>
        </div>

        <!-- Sanatan Panchang Section -->
        <h2 class="text-2xl font-bold mb-4">Sanatan Panchang</h2>
        <p class="text-black-700 max-w-2xl">
          Learn about the Sanatan Panchang, a traditional Sanatan calendar system that includes details about tithi, nakshatra, yoga, and karana.
        </p>
      </div>
    </div>
  `,
})
export class DateandtimeComponent implements OnInit, OnDestroy {
  selectedTab: string = 'general';

  currentDate: Date = new Date();
  currentDay: string = '';
  currentTime: string = '';
  countdownTime: string = '';
  location: string = 'Ujjain, India';
  paksha: string = '';
  masa: string = '';
  samvat: number = 1947;
  tithi: string = '';
  nakshatra: string = '';
  sunriseTime: string = '05:42';
  sunsetTime: string = '19:08';
  dayDuration: string = '';
  nightDuration: string = '';

  muhurats: Muhurat[] = [
    { name: 'राहु काल', time: '07:23', end: '09:04', significance: 'Avoid new beginnings', type: 'अशुभ' },
    { name: 'यम घंटा', time: '10:44', end: '12:25', significance: 'Inauspicious period', type: 'अशुभ' },
    { name: 'अभिजीत', time: '11:58', end: '12:52', significance: 'Most auspicious time', type: 'सक्रिय' },
    { name: 'गुली काल', time: '14:06', end: '15:47', significance: 'Avoid important work', type: 'अशुभ' },
    { name: 'दूर मुहूर्त', time: '12:52', end: '13:46', significance: 'Distant muhurat', type: 'अशुभ' },
  ];

  choghadiyas: Choghadiya[] = [
    { name: 'अमृत', time: '05:42', end: '07:23', significance: 'Nectar time - very auspicious', type: 'शुभ' },
    { name: 'काल', time: '07:23', end: '09:04', significance: 'Death time - avoid new work', type: 'अशुभ' },
    { name: 'शुभ', time: '09:04', end: '10:44', significance: 'Auspicious time', type: 'सक्रिय' },
    { name: 'रोग', time: '10:44', end: '12:25', significance: 'Disease time', type: 'अशुभ' },
    { name: 'उद्वेग', time: '12:25', end: '14:06', significance: 'Anxiety time', type: 'अशुभ' },
    { name: 'चर', time: '14:06', end: '15:47', significance: 'Moving time - good for travel', type: 'शुभ' },
  ];

  private timeSubscription: Subscription | null = null;
  private timerInterval: any;

  ngOnInit() {
    this.updateTimeAndDay();
    this.updatePanchangDetails();
    this.updateSunTimes();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateTimeAndDay();
    });
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  updateTimeAndDay() {
    const now = new Date();
    this.currentDate = now;
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    this.currentDay = days[now.getDay()];
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  updatePanchangDetails() {
    const today = new Date();
    const dayOfMonth = today.getDate();

    const tithis = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा', 'अमावस्या'];
    this.tithi = tithis[dayOfMonth % tithis.length];

    const nakshatras = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती'];
    this.nakshatra = nakshatras[dayOfMonth % nakshatras.length];
    
    this.paksha = dayOfMonth > 15 ? 'कृष्ण पक्ष' : 'शुक्ल पक्ष';
    const masas = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'अश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];
    this.masa = masas[today.getMonth()];
  }

  updateSunTimes() {
    const now = new Date();
    const isDaylightSaving = false;
    
    let hoursOffset = 0;
    if (isDaylightSaving) {
      hoursOffset = 1;
    }

    const sunriseMinutes = (6 * 60) + Math.sin(now.getTime() / 1000000000) * 30;
    const sunsetMinutes = (18 * 60) + Math.sin(now.getTime() / 1000000000) * 30;

    const formatTime = (totalMinutes: number) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const pad = (num: number) => num < 10 ? '0' + num : '' + num;
      return `${pad(hours)}:${pad(minutes)}`;
    };

    this.sunriseTime = formatTime(sunriseMinutes);
    this.sunsetTime = formatTime(sunsetMinutes);

    const dayDurationMinutes = sunsetMinutes - sunriseMinutes;
    const nightDurationMinutes = 24 * 60 - dayDurationMinutes;

    this.dayDuration = formatTime(dayDurationMinutes);
    this.nightDuration = formatTime(nightDurationMinutes);
  }

  startCountdown() {
    let seconds = 59;
    let minutes = 30;
    let hours = 23;

    this.timerInterval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 23;
          }
        }
      }
      const pad = (num: number) => num < 10 ? '0' + num : '' + num;
      this.countdownTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
  }
}
