import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-gradient-to-b from-orange-50 to-white flex items-center justify-center min-h-screen">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border-4 border-orange-50">
          <div class="mb-8">
            <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
              <div class="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                <span class="text-white text-5xl sm:text-7xl font-bold">404</span>
              </div>
            </div>
            <h2 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Page Not Found</h2>
            <p class="text-lg sm:text-xl text-black-700">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>
          
          <div class="space-y-4">
            <p class="text-gray-700 font-semibold text-lg">
                          </p>
            <a href="/" class="inline-block bg-orange-600 text-white font-medium px-8 py-3 rounded-full hover:bg-orange-700 transition-colors duration-300 shadow-lg transform hover:scale-105">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class NotFoundComponent { }
