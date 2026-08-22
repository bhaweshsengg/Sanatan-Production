import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { PanchangComponent } from '../panchang/panchang.component';
import { DateandtimeComponent } from '../dateandtime/dateandtime.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,PanchangComponent],
  animations: [
    trigger('fadeInUp', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(30px)'}),
        animate('600ms ease-out')
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({opacity: 0, transform: 'translateY(30px)'}),
          stagger(100, [
            animate('600ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
          ])
        ], {optional: true})
      ])
    ])
  ],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-orange-50 via-white to-pink-50 py-20 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-10 w-20 h-20 text-orange-600 text-6xl">ॐ</div>
        <div class="absolute top-32 right-20 w-16 h-16 text-orange-400 text-4xl">🕉️</div>
        <div class="absolute bottom-20 left-1/4 w-12 h-12 text-orange-300 text-3xl">🪔</div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div [@fadeInUp] class="mb-8">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 mb-6 shadow-lg">
            <span class="mr-2 text-lg">🕉️</span>
            Welcome to New Zealand's Sanatan Community
          </span>
        </div>
        
        <h1 [@fadeInUp] class="text-6xl md:text-7xl font-bold mb-8">
          <span class="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block mb-4">नमस्ते!</span>
          <span class="text-gray-900">Sanatan New Zealand</span>
        </h1>
        
        <p [@fadeInUp] class="text-xl text-black-700 max-w-4xl mx-auto mb-12 leading-relaxed">
          Your spiritual home in Aotearoa. Connect with temples, join festivals, explore Hindu traditions,
          and build meaningful relationships with fellow devotees across New Zealand.
        </p>
        
        <div [@fadeInUp] class="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <button routerLink="/temples" class="group bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center">
            <span class="mr-3 text-2xl group-hover:animate-bounce">🛕</span>
            Find Temples
          </button>
          <button routerLink="/events" class="group border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-orange-600 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
            <span class="mr-3 text-2xl group-hover:animate-bounce">📅</span>
            View Events
          </button>
        </div>
        
        <!-- Enhanced Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8" [@staggerIn]>
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
            <div class="text-orange-600 text-4xl mb-4 group-hover:animate-pulse">🛕</div>
            <div class="text-4xl font-bold text-gray-900 mb-2">50+</div>
            <div class="text-black-700 font-medium">Sanatan Temples</div>
          </div>
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
            <div class="text-orange-600 text-4xl mb-4 group-hover:animate-pulse">📅</div>
            <div class="text-4xl font-bold text-gray-900 mb-2">200+</div>
            <div class="text-black-700 font-medium">Monthly Events</div>
          </div>
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
            <div class="text-orange-600 text-4xl mb-4 group-hover:animate-pulse">👥</div>
            <div class="text-4xl font-bold text-gray-900 mb-2">5000+</div>
            <div class="text-black-700 font-medium">Community Members</div>
          </div>
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
            <div class="text-orange-600 text-4xl mb-4 group-hover:animate-pulse">📍</div>
            <div class="text-4xl font-bold text-gray-900 mb-2">15+</div>
            <div class="text-black-700 font-medium">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
<section> 
  <app-panchang></app-panchang>
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 mb-6">
            🌟 Platform Features
          </span>
          <h2 class="text-5xl font-bold text-gray-900 mb-6">Everything You Need</h2>
          <p class="text-xl text-black-700 max-w-3xl mx-auto">
            A comprehensive platform designed to keep you connected with the Hindu
            community in New Zealand.
          </p>
        </div>
        
        <div routerLink="/temples" class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <div class="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-orange-600">🛕</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Temple Directory</h3>
            <p class="text-black-700 leading-relaxed">
              Find Sanatan temples across all major cities in New Zealand with detailed information
            </p>
          </div>
          
          <div routerLink="/events"  class="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-orange-600">📅</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Event Calendar</h3>
            <p class="text-black-700 leading-relaxed">
              Stay updated with festivals, pujas, and community events happening near you
            </p>
          </div>
          
          <div  routerLink="/community" class="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-orange-600">👥</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Community Hub</h3>
            <p class="text-black-700 leading-relaxed">
              Connect with fellow devotees and join discussion groups and spiritual circles
            </p>
          </div>
          
          <div routerLink="/panchang"  class="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-orange-600">📚</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Spiritual Tools</h3>
            <p class="text-black-700 leading-relaxed">
              Access panchang, Sanatan calendar, mantras, and other spiritual resources daily
            </p>
          </div>
        </div>
      </div>
      
      <!-- Enhanced CTA Section -->
      <div class="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 py-20 overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-5xl font-bold text-white mb-6">Ready to Connect?</h2>
          <p class="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of devotees across New Zealand in our spiritual community. 
            Discover temples, attend events, and grow in your spiritual journey.
          </p>
          <div routerLink="/dashboard" class="flex flex-col sm:flex-row gap-6 justify-center">
            <button class="group bg-white text-orange-600 px-10 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center">
              <span class="mr-2 group-hover:animate-bounce">🚀</span>
              Explore Platform
            </button>
            <button class="group border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-white hover:text-orange-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <span class="mr-2 group-hover:animate-bounce">📱</span>
              Download App
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Preview Sections -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Featured Temples Preview -->
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-6">Featured Temples</h3>
            <p class="text-black-700 mb-8">Discover beautiful Sanatan temples across New Zealand</p>
            <div class="space-y-4">
              <div class="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  🛕
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">ISKCON Auckland</h4>
                  <p class="text-sm text-black-700">Krishna Temple • Auckland</p>
                </div>
                <div class="ml-auto flex items-center">
                  <span class="text-yellow-500 mr-1">⭐</span>
                  <span class="text-sm font-medium">4.9</span>
                </div>
              </div>
              <div class="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  🛕
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Shiva Vishnu Temple</h4>
                  <p class="text-sm text-black-700">Traditional Temple • Auckland</p>
                </div>
                <div class="ml-auto flex items-center">
                  <span class="text-yellow-500 mr-1">⭐</span>
                  <span class="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>
            <button routerLink="/temples" class="mt-6 text-orange-600 font-medium hover:text-orange-700 flex items-center">
              View All Temples <span class="ml-2">→</span>
            </button>
          </div>

          <!-- Upcoming Events Preview -->
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h3>
            <p class="text-black-700 mb-8">Join our vibrant community celebrations</p>
            <div class="space-y-4">
              <div class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Janmashtami Celebration</h4>
                  <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Festival</span>
                </div>
                <p class="text-sm text-black-700 mb-2">Monday, August 26 • 18:00</p>
                <p class="text-sm text-gray-500">250 attending</p>
              </div>
              <div class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Ganesha Chaturthi</h4>
                  <span class="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">Puja</span>
                </div>
                <p class="text-sm text-black-700 mb-2">Saturday, September 7 • 10:00</p>
                <p class="text-sm text-gray-500">180 attending</p>
              </div>
            </div>
            <button routerLink="/events" class="mt-6 text-orange-600 font-medium hover:text-orange-700 flex items-center">
              View All Events <span class="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    // Component initialization
  }
}