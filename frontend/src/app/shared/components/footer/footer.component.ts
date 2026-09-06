import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-12">
          <!-- Brand Section -->
          <div class="md:col-span-1">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                ॐ
              </div>
              <div>
                <h3 class="text-2xl font-bold">Sanatan NZ</h3>
                <p class="text-gray-400 text-sm">Community Platform</p>
              </div>
            </div>
            <p class="text-gray-400 mb-6 leading-relaxed">
              Connecting the Sanatan community across New Zealand through dharma, culture, and unity.
            </p>

          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-semibold mb-6 text-orange-400">Quick Links</h4>
            <ul class="space-y-3">
              <li><a routerLink="/temples" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">🛕</span> Find Temples
              </a></li>
              <li><a routerLink="/events" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">📅</span> Events
              </a></li>
              <li><a routerLink="/community" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">👥</span> Community
              </a></li>
              <li><a routerLink="business/register" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">🏢</span> Business Directory
              </a></li>
            </ul>
          </div>
          
          <!-- Spiritual Tools -->
          <div>
            <h4 class="text-lg font-semibold mb-6 text-orange-400">Spiritual Tools</h4>
            <ul class="space-y-3">
              <li><a routerLink="/panchang" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">📅</span> Live Panchang
              </a></li>
              <li><a routerLink="/festival" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">🎉</span> Festival Calendar
              </a></li>
              <li><a routerLink="/dateandtime" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">🕐</span> Hindu Time
              </a></li>
              <li><a routerLink="/panchang" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">📿</span> Daily Mantras
              </a></li>
              <li><a routerLink="/about" class="text-gray-400 hover:text-white transition-colors flex items-center">
                <span class="mr-2">ℹ️</span> About Us
              </a></li>
            </ul>
          </div>
          
          <!-- Contact & Newsletter -->
          <div>
            <h4 class="text-lg font-semibold mb-6 text-orange-400">Stay Connected</h4>
            <ul class="space-y-3 mb-6">
              <li class="flex items-center text-gray-400">
                <span class="mr-3 text-orange-400">📧</span>
                <span class="text-sm">info&#64;sanatan.nz</span>
              </li>
              <li class="flex items-center text-gray-400">
                <span class="mr-3 text-orange-400">📞</span>
                <span class="text-sm">+64 210 220 3440</span>
              </li>
              <li class="flex items-center text-gray-400">
                <span class="mr-3 text-orange-400">🌐</span>
                <span class="text-sm">sanatan.nz</span>
              </li>
            </ul>
            
            <!-- Newsletter Signup -->
            <div class="bg-gray-800 rounded-lg p-4">
              <h5 class="font-semibold mb-3 text-orange-400">Newsletter</h5>
              <p class="text-sm text-gray-400 mb-3">Get updates on events and festivals</p>
              <div class="flex">
                <input type="email" placeholder="Your email" 
                       class="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <button class="bg-orange-600 px-4 py-2 rounded-r-md hover:bg-orange-700 transition-colors">
                  <span class="text-sm">📧</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Section -->
        <div class="border-t border-gray-700 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-gray-400 text-sm mb-4 md:mb-0">
             © {{ currentYear }} Sanatan New Zealand. Made with ❤️ for the Hindu community. 🕉️
            </div>
            <div class="flex space-x-6 text-sm">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              Serving the Sanatan community since 2020 • Registered Charity in New Zealand • Supported by Devbhoomi Charitable Trust NZ
            </p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}