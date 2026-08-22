import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for form directives

@Component({
  selector: 'app-add-event',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Import necessary modules for standalone components
  template: `
    <div class="container mx-auto mt-20 px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-gray-900">Create Community Event</h2>
            <span class="text-sm text-gray-500">Step 1 of 6</span>
          </div>
          <div aria-valuemax="100" aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" class="relative w-full overflow-hidden rounded-full bg-secondary h-2">
            <div data-state="indeterminate" data-max="100" class="h-full w-full flex-1 bg-primary transition-all" style="transform: translateX(-83.3333%);"></div>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <div class="text-2xl font-semibold leading-none tracking-tight">Event Details</div>
            <div class="text-sm text-muted-foreground">Provide complete information about your event to help community members understand and participate.</div>
          </div>
          <div class="p-6 pt-0">
            <form class="space-y-8">
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="title">Event Title *</label>
                  <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="title" placeholder="e.g., Diwali Celebration 2024" value="">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="category">Category *</label>         
                  <!-- The hidden select element from the original HTML is replaced with a visible one for direct interaction -->
                  <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="category">
                    <option value="" disabled selected>Select event category</option>
                    <option value="Religious">Religious</option>
                    <option value="Festival">Festival</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Educational">Educational</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Youth Programs">Youth Programs</option>
                    <option value="Senior Activities">Senior Activities</option>
                    <option value="Music &amp; Arts">Music &amp; Arts</option>
                    <option value="Food &amp; Cooking">Food &amp; Cooking</option>
                    <option value="Sports &amp; Recreation">Sports &amp; Recreation</option>
                    <option value="Charity">Charity</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="description">Event Description *</label>
                  <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="description" placeholder="Describe your event, what participants can expect, and any special highlights..." rows="4"></textarea>
                  <p class="text-sm text-gray-500">0/500 characters (minimum 50)</p>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <div class="flex gap-2 flex-1">
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ml-auto bg-transparent" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save mr-2 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                    Save Draft
                  </button>
                </div>
                <div class="flex gap-2">
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700" type="button">Next</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="text-center mt-8">
          <p class="text-black-700">Questions about creating events? <a class="text-orange-600 hover:underline" href="/help">Check our guidelines</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [] // Tailwind CSS classes are used, so no additional inline styles are needed.
})
export class AddEventComponent {
  // Any component logic would go here
}
