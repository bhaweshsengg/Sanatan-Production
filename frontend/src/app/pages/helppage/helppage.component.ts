import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components

@Component({
  selector: 'app-helppage',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Import necessary modules
  template: `
    <div class="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header class="border-b bg-white">
        <div class="container mx-auto px-4 py-4">
          <a class="flex items-center space-x-2" href="/">
            <div
              class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">🕉</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                Sanatan New Zealand
              </h1>
              <p class="text-sm text-black-700">Help &amp; Support Center</p>
            </div>
          </a>
        </div>
      </header>
      <div class="container mx-auto px-4 py-12">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h1
              class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-help h-10 w-10 text-orange-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              Help &amp; Support
            </h1>
            <p class="text-xl text-black-700 max-w-2xl mx-auto">
              Find answers to your questions and get the help you need to make
              the most of our spiritual community platform
            </p>
          </div>
          <div
            class="rounded-lg border bg-card text-card-foreground shadow-sm mb-12 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50"
          >
            <div class="p-8">
              <div
                class="flex flex-col md:flex-row items-center justify-between"
              >
                <div class="mb-6 md:mb-0">
                  <h2
                    class="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-book-open h-6 w-6 text-orange-600"
                    >
                      <path d="M12 7v14"></path>
                      <path
                        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                      ></path>
                    </svg>
                    Complete User Manual
                  </h2>
                  <p class="text-black-700 mb-4">
                    Comprehensive guide covering registration, login, password
                    management, and all platform features
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <div
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                    >
                      Step-by-step guides
                    </div>
                    <div
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                    >
                      Screenshots included
                    </div>
                    <div
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                    >
                      Troubleshooting tips
                    </div>
                  </div>
                </div>
                <a
                  class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-10 bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3"
                  routerLink="/help/usermanual"
                >
                  View User Manual
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-arrow-right ml-2 h-5 w-5"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div
                  class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-book-open h-6 w-6 text-orange-600"
                  >
                    <path d="M12 7v14"></path>
                    <path
                      d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                    ></path>
                  </svg>
                  Getting Started
                </div>
                <div class="text-sm text-muted-foreground">
                  New to our platform? Start here
                </div>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-3">
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Complete User Manual</span
                      >
                      <div
                        class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs"
                      >
                        Comprehensive
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Registration Guide</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Login Instructions</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Profile Setup</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div
                  class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-circle-help h-6 w-6 text-orange-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Account &amp; Security
                </div>
                <div class="text-sm text-muted-foreground">
                  Manage your account safely
                </div>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-3">
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Password Management</span
                      >
                      <div
                        class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs"
                      >
                        Important
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Two-Factor Authentication</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Privacy Settings</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Account Recovery</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div
                  class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-users h-6 w-6 text-orange-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Community Features
                </div>
                <div class="text-sm text-muted-foreground">
                  Connect with fellow devotees
                </div>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-3">
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Finding Mandirs</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Joining Satsangs</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Community Discussions</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Making Donations</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div
                  class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-message-circle h-6 w-6 text-orange-600"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  Technical Support
                </div>
                <div class="text-sm text-muted-foreground">
                  Troubleshooting and technical help
                </div>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-3">
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Common Issues</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Browser Compatibility</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >Mobile App Guide</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    routerLink="/help/usermanual"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-gray-700 group-hover:text-orange-600"
                        >System Requirements</span
                      >
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-4 w-4 text-gray-400 group-hover:text-orange-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            class="rounded-lg border bg-card text-card-foreground shadow-sm mb-8"
          >
            <div class="flex flex-col space-y-1.5 p-6">
              <div
                class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-message-circle h-5 w-5"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                </svg>
                Contact Support
              </div>
              <div class="text-sm text-muted-foreground">
                Can't find what you're looking for? Get in touch with our
                support team
              </div>
            </div>
            <div class="p-6 pt-0">
              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center p-6 border rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-mail h-8 w-8 text-orange-600 mx-auto mb-3"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    Email Support
                  </h3>
                  <p class="text-sm text-black-700 mb-4">
                    Get detailed help via email
                  </p>
                  <a
                    href="mailto:support@sanatannz.com"
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    support&#64;sanatannz.com
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-external-link ml-2 h-4 w-4"
                    >
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14 21 3"></path>
                      <path
                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div class="text-center p-6 border rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-phone h-8 w-8 text-orange-600 mx-auto mb-3"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    ></path>
                  </svg>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    Phone Support
                  </h3>
                  <p class="text-sm text-black-700 mb-4">
                    Speak directly with our team
                  </p>
                  <a
                    href="tel:+6491234567"
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    +64 9 123 4567
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-external-link ml-2 h-4 w-4"
                    >
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14 21 3"></path>
                      <path
                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div class="text-center p-6 border rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-message-circle h-8 w-8 text-orange-600 mx-auto mb-3"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  <h3 class="font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p class="text-sm text-black-700 mb-4">
                    Instant help during business hours
                  </p>
                  <button
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    Start Chat
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-message-circle ml-2 h-4 w-4"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-2">Support Hours</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM NZST
                  </div>
                  <div>
                    <strong>Saturday - Sunday:</strong> 10:00 AM - 4:00 PM NZST
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="flex flex-col space-y-1.5 p-6">
              <div
                class="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-file-text h-5 w-5"
                >
                  <path
                    d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                  ></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                Additional Resources
              </div>
              <div class="text-sm text-muted-foreground">
                More ways to learn and get help
              </div>
            </div>
            <div class="p-6 pt-0">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h4 class="font-medium text-gray-900">Documentation</h4>
                  <div class="space-y-2">
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-file-text h-4 w-4 mr-2"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                        ></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                      API Documentation
                    </a>
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-file-text h-4 w-4 mr-2"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                        ></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                      Developer Guide
                    </a>
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-file-text h-4 w-4 mr-2"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                        ></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                      Changelog
                    </a>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4 class="font-medium text-gray-900">Community</h4>
                  <div class="space-y-2">
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-users h-4 w-4 mr-2"
                      >
                        <path
                          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        ></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Community Forum
                    </a>
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-video h-4 w-4 mr-2"
                      >
                        <path
                          d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
                        ></path>
                        <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                      </svg>
                      Video Tutorials
                    </a>
                    <a
                      class="flex items-center text-orange-600 hover:underline"
                      routerLink="/help/usermanual"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-circle-help h-4 w-4 mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                      Frequently Asked Questions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [], // Tailwind CSS classes are used, so no additional inline styles are needed.
})
export class HelppageComponent {
  // Any component logic would go here
}
