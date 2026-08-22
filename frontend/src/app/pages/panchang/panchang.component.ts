import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panchang',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div>
          <div class="text-center mb-16">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4">
              🕐 Live Sanatan Calendar
            </span>
            <h2 class="text-4xl font-bold text-gray-900 mb-4">आज का पंचांग - Today's Panchang</h2>
            <p class="text-xl text-black-700 max-w-3xl mx-auto">
              Stay connected with Sanatan time and auspicious moments. Access live
              panchang data, muhurat timings, and spiritual guidance for your daily practices.
            </p>
          </div>
          
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-2xl font-bold mb-1">🕐 सनातन पंचांग</h3>
                  <p class="text-orange-100">08 अगस्त 2025, शुक्रवार</p>
                </div>
                <div class="text-right">
                  <p class="text-orange-100">📍 Ujjain, India</p>
                  <p class="text-orange-100">शुक्ल पक्ष, ज्येष्ठ 1947 शक</p>
                </div>
              </div>
            </div>
            
            <div class="p-8">
              <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="text-center">
                  <div class="bg-orange-100 rounded-lg p-4 mb-4">
                    <div class="flex justify-center space-x-4 mb-4">
                      <span class="bg-orange-600 text-white px-3 py-1 rounded text-sm">सामान्य जानकारी</span>
                      <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">मुहूर्त</span>
                      <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">चौघड़िया</span>
                      <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">रश्मि पत्री</span>
                    </div>
                    
                    <div class="text-6xl font-bold text-orange-600 mb-2">{{currentTime}}</div>
                    <p class="text-black-700">घंटे : मिनट : सेकंड</p>
                  </div>
                  
                  <div class="text-center mb-6">
                    <p class="text-lg text-gray-700 mb-2">08:21:51 <span class="text-sm text-gray-500">शुक्रवार</span></p>
                  </div>
                  
                  <div class="bg-orange-50 rounded-lg p-4 mb-4">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-700 font-medium">वर्तमान काल</span>
                      <div class="flex items-center">
                        <span class="text-orange-600 font-bold">काल</span>
                        <span class="ml-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">🕐</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <div class="text-orange-600 text-2xl mb-2">☀️</div>
                    <div class="text-sm text-black-700 mb-1">सूर्योदय</div>
                    <div class="font-bold text-orange-600">05:42</div>
                  </div>
                  
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-blue-600 text-2xl mb-2">🌙</div>
                    <div class="text-sm text-black-700 mb-1">सूर्यास्त</div>
                    <div class="font-bold text-blue-600">19:08</div>
                  </div>
                  
                  <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="text-purple-600 text-2xl mb-2">📅</div>
                    <div class="text-sm text-black-700 mb-1">तिथि</div>
                    <div class="font-bold text-purple-600">सप्तमी</div>
                  </div>
                  
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-green-600 text-2xl mb-2">🌿</div>
                    <div class="text-sm text-black-700 mb-1">नक्षत्र</div>
                    <div class="font-bold text-green-600">पुष्य 17°32'</div>
                  </div>
                </div>
              </div>
              
              <div class="border-t pt-6">
                <div class="flex justify-between items-center text-sm text-black-700 mb-4">
                  <span>दिन की अवधि: 13:26:00</span>
                  <span>रात्रि की अवधि: 10:33:54</span>
                  <button class="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-200">
                    पत्री पत्र Converter
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-8" *ngIf="!showFullPanchang">
            <button (click)="showFullPanchang = true"
              class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-50">
              📱 View Full Panchang
            </button>
          </div>
        </div>

        <section *ngIf="showFullPanchang" class="py-16 bg-gradient-to-b from-[#fffaf5] to-white">
          <div class="max-w-5xl mx-auto px-4">

            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold text-orange-700">Daily Panchang</h2>
              <p class="text-black-700 mt-2 max-w-2xl mx-auto">
                The Panchang provides auspicious timings and astrological information
                according to the Sanatan calendar, customized for New Zealand time zone.
              </p>
            </div>

            <div class="bg-orange-100 border border-orange-200 rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center mb-8">
              <div class="flex items-center mb-4 md:mb-0">
                <span class="text-orange-600 text-xl mr-2">📅</span>
                <h3 class="font-semibold text-orange-700">Today's Date</h3>
              </div>
              <div class="grid md:grid-cols-2 gap-6 text-center w-full">
                <div>
                  <p class="text-sm text-gray-500">Gregorian Date</p>
                  <p class="font-bold text-lg text-gray-900">Saturday, August 16, 2025</p>
                  <p class="text-sm text-black-700">10:47 PM (New Zealand Time)</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Sanatan Calendar</p>
                  <p class="font-bold text-lg text-gray-900">Vikram Samvat 2082</p>
                  <p class="text-sm text-black-700">आषाढ़, कृष्ण पक्ष</p>
                </div>
              </div>
            </div>

            <div class="flex justify-center space-x-6 mb-8">
              <button
                (click)="selectedTab = 'main-elements'"
                [ngClass]="{
                  'border-b-2 border-orange-600 text-orange-700 font-medium': selectedTab === 'main-elements',
                  'text-gray-500 hover:text-orange-600': selectedTab !== 'main-elements'
                }"
                class="px-4 py-2"
              >
                Main Elements
              </button>
              <button
                (click)="selectedTab = 'auspicious-timings'"
                [ngClass]="{
                  'border-b-2 border-orange-600 text-orange-700 font-medium': selectedTab === 'auspicious-timings',
                  'text-gray-500 hover:text-orange-600': selectedTab !== 'auspicious-timings'
                }"
                class="px-4 py-2"
              >
                Auspicious Timings
              </button>
              <button
                (click)="selectedTab = 'planetary-positions'"
                [ngClass]="{
                  'border-b-2 border-orange-600 text-orange-700 font-medium': selectedTab === 'planetary-positions',
                  'text-gray-500 hover:text-orange-600': selectedTab !== 'planetary-positions'
                }"
                class="px-4 py-2"
              >
                Planetary Positions
              </button>
            </div>

            <div [ngSwitch]="selectedTab">
              <div *ngSwitchCase="'main-elements'">
                <div class="grid md:grid-cols-3 gap-6 mb-10">
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Tithi</p>
                    <p class="font-medium text-gray-800">Krishna Paksha Dashami</p>
                    <p class="text-xs text-gray-500">The lunar day based on the moon’s longitudinal angle</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-purple-100">
                    <p class="text-purple-600 font-semibold mb-1">Nakshatra</p>
                    <p class="font-medium text-gray-800">Purva Bhadrapada</p>
                    <p class="text-xs text-gray-500">The lunar mansion or constellation</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-yellow-100">
                    <p class="text-yellow-600 font-semibold mb-1">Yoga</p>
                    <p class="font-medium text-gray-800">Siddha</p>
                    <p class="text-xs text-gray-500">The sum of the sun and moon’s longitudinal angle</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-pink-100">
                    <p class="text-pink-600 font-semibold mb-1">Karana</p>
                    <p class="font-medium text-gray-800">Kaulava</p>
                    <p class="text-xs text-gray-500">Half of a Tithi, important for timing of activities</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-blue-100">
                    <p class="text-blue-600 font-semibold mb-1">Sunrise & Sunset</p>
                    <p class="font-medium text-gray-800">6:15 AM — 8:30 PM</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-red-100">
                    <p class="text-red-600 font-semibold mb-1">Moonrise & Moonset</p>
                    <p class="font-medium text-gray-800">10:45 AM — 11:20 PM</p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="'auspicious-timings'">
                <div class="grid md:grid-cols-3 gap-6 mb-10">
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Rahu Kalam</p>
                    <p class="font-medium text-gray-800">9:00 AM - 10:30 AM</p>
                    <p class="text-xs text-gray-500">Inauspicious time, avoid starting new activities</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Yama Gandam</p>
                    <p class="font-medium text-gray-800">1:30 PM - 3:00 PM</p>
                    <p class="text-xs text-gray-500">Inauspicious period, avoid important work</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Gulika</p>
                    <p class="font-medium text-gray-800">7:30 AM - 9:00 AM</p>
                    <p class="text-xs text-gray-500">Inauspicious time, avoid new beginnings</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Abhijit Muhurta</p>
                    <p class="font-medium text-gray-800">12:00 PM - 12:45 PM</p>
                    <p class="text-xs text-gray-500">Most auspicious time of the day</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Amrit Kalam</p>
                    <p class="font-medium text-gray-800">7:15 AM - 8:45 AM</p>
                    <p class="text-xs text-gray-500">Highly auspicious time for all activities</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Mahakal's Actual Time</p>
                    <p class="font-medium text-gray-800">06:17 AM (Ujjain Time)</p>
                    <p class="text-xs text-gray-500">(Approximate time based on Ujjain, India. Requires precise astrological calculation for accuracy.)</p>
                  </div>
                  <div class="bg-white shadow rounded-lg p-4 border border-orange-100">
                    <p class="text-orange-600 font-semibold mb-1">Mahallal Timings</p>
                    <p class="font-medium text-gray-800">Sunrise: 6:15 AM, Sunset: 8:30 PM (Local)</p>
                    <p class="text-xs text-gray-500">(Local timings for specific religious practices. Requires precise calculation.)</p>
                  </div>
                </div>
              </div>

              <div *ngSwitchCase="'planetary-positions'">
                <div class="grid md:grid-cols-2 gap-6 mb-10">
                  <div class="bg-white shadow rounded-lg p-6 border border-orange-100">
                    <h3 class="font-semibold text-orange-700 mb-4">Planetary Positions</h3>
                    <table class="w-full text-left table-auto">
                      <thead>
                        <tr class="text-gray-500 text-sm font-medium border-b border-gray-200">
                          <th class="py-2">Planet</th>
                          <th class="py-2">Sign</th>
                          <th class="py-2">Degree</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Sun</td>
                          <td class="py-2 text-gray-800">Aries</td>
                          <td class="py-2 text-gray-800">15°30'</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Moon</td>
                          <td class="py-2 text-gray-800">Leo</td>
                          <td class="py-2 text-gray-800">23°45'</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Mars</td>
                          <td class="py-2 text-gray-800">Gemini</td>
                          <td class="py-2 text-gray-800">8°12'</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Mercury</td>
                          <td class="py-2 text-gray-800">Taurus</td>
                          <td class="py-2 text-gray-800">2°18'</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Jupiter</td>
                          <td class="py-2 text-gray-800">Taurus</td>
                          <td class="py-2 text-gray-800">17°22'</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                          <td class="py-2 text-gray-800">Venus</td>
                          <td class="py-2 text-gray-800">Gemini</td>
                          <td class="py-2 text-gray-800">5°40'</td>
                        </tr>
                        <tr>
                          <td class="py-2 text-gray-800">Saturn</td>
                          <td class="py-2 text-gray-800">Aquarius</td>
                          <td class="py-2 text-gray-800">29°51'</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="bg-white shadow rounded-lg p-6 border border-orange-100">
                    <h3 class="font-semibold text-orange-700 mb-4">Daily Predictions</h3>
                    <p class="text-sm text-black-700 mb-4">
                      Today is generally favorable for spiritual activities, learning, and
                      family gatherings. The alignment of Jupiter and Venus creates
                      positive energy for new beginnings.
                    </p>
                    <h4 class="font-medium text-gray-800 mb-2">Favorable Activities:</h4>
                    <ul class="list-disc list-inside text-sm text-black-700 mb-4">
                      <li>Religious ceremonies and prayers</li>
                      <li>Educational pursuits</li>
                      <li>Family gatherings</li>
                      <li>Starting new projects (after Rahu Kalam)</li>
                    </ul>
                    <h4 class="font-medium text-red-600 mb-2">Avoid:</h4>
                    <ul class="list-disc list-inside text-sm text-black-700">
                      <li>Major financial decisions during Rahu Kalam</li>
                      <li>Travel in southward direction</li>
                      <li>Signing important documents during inauspicious hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-center text-sm text-gray-500 mb-4">
              Note: This Panchang is calculated for Auckland, New Zealand. Times may vary slightly for other locations.<br>
              Last updated: August 16, 2025 10:47 PM NZST
            </p>

            <div class="text-center">
              <h4 class="text-orange-700 font-bold mb-2">Namaste Sanatan New Zealand</h4>
              <p class="text-black-700 max-w-2xl mx-auto text-sm">
                The Panchang is a Sanatan calendar and almanac that follows traditional timekeeping systems.
                It provides information about auspicious times, planetary positions, and other important astrological
                details to guide daily activities and religious observances.
              </p>
            </div>

          </div>
        </section>


      </div>
    </section>
  `
})
export class PanchangComponent implements OnInit, OnDestroy {
  currentTime: string = '20:54:37';
  private timeInterval: any;
  showFullPanchang: boolean = false;
  selectedTab: string = 'main-elements';

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-GB', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}