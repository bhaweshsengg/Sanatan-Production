import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-white z-50 flex items-center justify-center" 
         [class.hidden]="!isLoading">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 animate-pulse">
          ॐ
        </div>
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <p class="mt-4 text-black-700 font-medium">Loading Sanatan New Zealand...</p>
      </div>
    </div>
  `
})
export class LoadingComponent {
  isLoading = false;

  constructor() {
    // Simulate loading
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}