import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for two-way data binding with ngModel
import { RouterModule } from '@angular/router'; // Import RouterModule to use routerLink

@Component({
  selector: 'app-adddiscussion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add RouterModule here
  template: `
    <div class="flex flex-col items-center pt-16 mt-10 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100">
      <!-- Header -->
      <div class="flex flex-col items-center text-center mb-8">
        <div class="p-4 bg-orange-500 rounded-full text-white mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 12.016a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800">Start a Discussion</h1>
        <p class="text-black-700 mt-2 text-sm sm:text-base">Share your thoughts, ask questions, or start conversations with the Hindu community</p>
      </div>

      <!-- Community Guidelines Section -->
      <div class="w-full max-w-2xl bg-orange-50 p-6 sm:p-8 rounded-lg shadow-md mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-orange-800 mb-4">Community Guidelines</h2>
        <ul class="list-disc list-inside text-orange-700 space-y-2 text-sm">
          <li>Be respectful and kind to all community members</li>
          <li>Keep discussions relevant to the Hindu community in New Zealand</li>
          <li>Use clear, descriptive titles that help others understand your topic</li>
          <li>Add relevant tags to help others find your discussion</li>
          <li>Avoid spam, self-promotion, or inappropriate content</li>
        </ul>
      </div>

      <!-- New Discussion Form -->
      <div class="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">New Discussion</h2>
        <p class="text-sm text-gray-500 mb-6">Share your thoughts, questions, or ideas with the community</p>

        <!-- Discussion Title -->
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-medium mb-1">Discussion Title <span class="text-red-500">*</span></label>
          <input type="text" id="title" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Best places for vegetarian food in Auckland?" />
        </div>

        <!-- Category & City -->
        <div class="mb-4 flex flex-col sm:flex-row sm:space-x-4">
          <div class="flex-1 mb-4 sm:mb-0">
            <label for="category" class="block text-gray-700 text-sm font-medium mb-1">Category <span class="text-red-500">*</span></label>
            <select id="category" class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select category</option>
              <!-- Add your options here -->
            </select>
          </div>
          <div class="flex-1">
            <label for="city" class="block text-gray-700 text-sm font-medium mb-1">Relevant City (Optional)</label>
            <select id="city" class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select city</option>
              <!-- Add your options here -->
            </select>
          </div>
        </div>

        <!-- Discussion Content -->
        <div class="mb-4">
          <label for="content" class="block text-gray-700 text-sm font-medium mb-1">Discussion Content <span class="text-red-500">*</span></label>
          <textarea id="content" class="w-full p-2 border border-gray-300 rounded-md resize-y min-h-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Share your thoughts, ask your question, or describe what you'd like to discuss..."></textarea>
          <p class="text-xs text-gray-500 mt-1">0/2000 characters</p>
        </div>

        <!-- Tags -->
        <div class="mb-6">
          <label for="tags" class="block text-gray-700 text-sm font-medium mb-1">Tags (Optional)</label>
          <p class="text-xs text-gray-500 mb-2">Add up to 5 tags to help others find your discussion</p>
          <div class="flex items-center space-x-2">
            <input type="text" id="tags" class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Add a tag..." />
            <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors">Add</button>
          </div>
          <div class="flex flex-wrap gap-2 mt-4 text-xs">
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#vegetarian</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#temples</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#festivals</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#yoga</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#sanskrit</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#cooking</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#music</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">#dance</span>
          </div>
        </div>

        <!-- Post Button -->
        <button class="w-full bg-orange-600 text-white p-3 rounded-md font-semibold hover:bg-orange-700 transition-colors" routerLink="/community/discussion/new">Post Discussion</button>
      </div>

      <!-- Help Text -->
      <p class="text-sm text-black-700 text-center">Need help with posting? <a href="#" class="text-orange-600 hover:underline">View posting guidelines</a></p>
    </div>
  `,
  styles: [`
    /* No custom styles needed, all styling is done via Tailwind CSS classes in the template. */
  `]
})
export class AdddiscussionComponent {

}
