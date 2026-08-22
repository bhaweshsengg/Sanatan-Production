import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header Section -->
        <div class="flex items-center justify-between mb-16">
          <div class="flex items-center">
            <!-- Simplified Logo placeholder -->
            <div class="bg-orange-500 text-white rounded-lg p-2 font-bold text-xl">
              SNZ
            </div>
            <span class="ml-4 text-2xl font-semibold text-gray-900">About Us</span>
          </div>
          <!-- Placeholder Search Bar -->
          <div class="hidden sm:block">
            <input type="text" placeholder="Search..." class="rounded-lg border border-gray-300 px-4 py-2 focus:ring-orange-500 focus:border-orange-500">
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
          <div class="text-center mb-12">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4">
              ✨ Our Journey
            </span>
            <h2 class="text-4xl font-bold text-gray-900 mb-4">About Sanatan New Zealand</h2>
            <p class="text-xl text-black-700 max-w-3xl mx-auto">
              Our mission is to foster a vibrant Sanatan community in New Zealand by
              promoting cultural and spiritual practices rooted in ancient traditions.
            </p>
          </div>

          <!-- Section: Our Dharma -->
          <div class="mb-12">
            <div class="flex items-center justify-center mb-6">
              <span class="text-2xl mr-2">🪔</span>
              <h3 class="text-2xl font-bold text-gray-900">Our Dharma (Our Duty)</h3>
            </div>
            <div class="bg-orange-50 rounded-lg p-6">
              <p class="text-lg text-gray-700 leading-relaxed text-center">
                We believe in serving humanity through selfless actions and preserving the timeless values of Sanatan Dharma.
                Our commitment extends to fostering a deeper understanding of our rich heritage and supporting local communities.
              </p>
            </div>
          </div>

          <!-- Section: Community Pillars -->
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <span class="text-2xl mr-2">🤝</span>
                <h4 class="text-xl font-semibold text-gray-800">Community Outreach</h4>
              </div>
              <p class="text-black-700 leading-relaxed">
                We organize various events and initiatives to engage with the wider community,
                promoting inter-faith dialogue and social harmony.
              </p>
            </div>
            <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <span class="text-2xl mr-2">📚</span>
                <h4 class="text-xl font-semibold text-gray-800">Educational Initiatives</h4>
              </div>
              <p class="text-black-700 leading-relaxed">
                Our educational programs aim to pass on the knowledge of ancient scriptures,
                philosophy, and practices to the next generation, ensuring our traditions endure.
              </p>
            </div>
          </div>

          <!-- Final Call to Action Section -->
          <div class="text-center">
            <h4 class="text-2xl font-bold text-orange-700 mb-4">Join Our Community</h4>
            <p class="text-black-700 max-w-xl mx-auto mb-6">
              Be a part of our growing family. Connect with us and stay updated on events,
              spiritual guidance, and community projects.
            </p>
            <button class="bg-orange-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-orange-700 shadow-md transition-colors duration-300">
              Contact Us
            </button>
          </div>

        </div>

      </div>
    </section>
  `,
  styles: []
})
export class AboutComponent { }
