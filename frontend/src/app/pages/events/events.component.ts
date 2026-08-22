import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4"
          >
            📅 Community Gatherings
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p class="text-xl text-black-700 max-w-3xl mx-auto">
            Join our vibrant community in celebrating festivals, attending
            satsangs, and participating in spiritual activities across New
            Zealand.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div
            class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">
                Janmashtami Celebration
              </h3>
              <span
                class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium"
                >Festival</span
              >
            </div>
            <p class="text-black-700 mb-4">ISKCON Auckland</p>

            <div class="space-y-2 mb-6">
              <div class="flex items-center text-black-700">
                <span class="mr-2">📅</span>
                <span>Monday, August 26</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">🕐</span>
                <span>18:00</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">👥</span>
                <span>250 attending</span>
              </div>
            </div>

            <button
              class="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Join Event
            </button>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">Ganesha Chaturthi</h3>
              <span
                class="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm font-medium"
                >Puja</span
              >
            </div>
            <p class="text-black-700 mb-4">Ganesh Temple</p>

            <div class="space-y-2 mb-6">
              <div class="flex items-center text-black-700">
                <span class="mr-2">📅</span>
                <span>Saturday, September 7</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">🕐</span>
                <span>10:00</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">👥</span>
                <span>180 attending</span>
              </div>
            </div>

            <button
              class="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Join Event
            </button>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">
                Bhagavad Gita Study
              </h3>
              <span
                class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium"
                >Satsang</span
              >
            </div>
            <p class="text-black-700 mb-4">Community Center</p>

            <div class="space-y-2 mb-6">
              <div class="flex items-center text-black-700">
                <span class="mr-2">📅</span>
                <span>Tuesday, August 20</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">🕐</span>
                <span>19:00</span>
              </div>
              <div class="flex items-center text-black-700">
                <span class="mr-2">👥</span>
                <span>45 attending</span>
              </div>
            </div>

            <button
              class="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Join Event
            </button>
          </div>
        </div>

        <div class="text-center">
          <button
            class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-50"
          >
            View All Events →
          </button>
        </div>
        <section class="bg-orange-50 py-12 mt-10">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Organizing an event?
            </h2>
            <p class="text-black-700 mb-6">
              Share your Sanatan cultural events, festivals, or community
              gatherings with the wider community. Help bring people together
              through shared celebrations and learning.
            </p>
            <button
              routerLink="/events/add-event"
              class="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              + Create Event
            </button>
          </div>
        </section>
      </div>
    </section>
  `,
})
export class EventsComponent {}
