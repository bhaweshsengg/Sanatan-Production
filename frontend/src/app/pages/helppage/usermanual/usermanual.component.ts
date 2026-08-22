import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components

@Component({
  selector: 'app-usermanual',
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
              <p class="text-sm text-black-700">User Manual &amp; Guide</p>
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
                class="lucide lucide-book-open h-10 w-10 text-orange-600"
              >
                <path d="M12 7v14"></path>
                <path
                  d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                ></path>
              </svg>
              Complete User Manual
            </h1>
            <p class="text-xl text-black-700">
              Your comprehensive guide to joining and using the Sanatan New
              Zealand platform
            </p>
          </div>
          <div dir="ltr" data-orientation="horizontal">
            <div
              role="tablist"
              aria-orientation="horizontal"
              class="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-5 mb-8"
              tabindex="0"
              data-orientation="horizontal"
              style="outline: none;"
            >
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r6f»-content-overview"
                data-state="inactive"
                id="radix-«r6f»-trigger-overview"
                class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
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
                  class="lucide lucide-info h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path></svg
                >Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r6f»-content-registration"
                data-state="inactive"
                id="radix-«r6f»-trigger-registration"
                class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
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
                  class="lucide lucide-user h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle></svg
                >Registration
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r6f»-content-login"
                data-state="inactive"
                id="radix-«r6f»-trigger-login"
                class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
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
                  class="lucide lucide-lock h-4 w-4"
                >
                  <rect
                    width="18"
                    height="11"
                    x="3"
                    y="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg
                >Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-«r6f»-content-password"
                data-state="inactive"
                id="radix-«r6f»-trigger-password"
                class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
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
                  class="lucide lucide-shield h-4 w-4"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  ></path></svg
                >Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="true"
                aria-controls="radix-«r6f»-content-troubleshooting"
                data-state="active"
                id="radix-«r6f»-trigger-troubleshooting"
                class="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
                tabindex="0"
                data-orientation="horizontal"
                data-radix-collection-item=""
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
                  class="lucide lucide-circle-help h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path></svg
                >Help
              </button>
            </div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-«r6f»-trigger-overview"
              id="radix-«r6f»-content-overview"
              tabindex="0"
              class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
              hidden=""
              style=""
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-«r6f»-trigger-registration"
              id="radix-«r6f»-content-registration"
              tabindex="0"
              class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
              hidden=""
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-«r6f»-trigger-login"
              id="radix-«r6f»-content-login"
              tabindex="0"
              class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
              hidden=""
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-«r6f»-trigger-password"
              id="radix-«r6f»-content-password"
              tabindex="0"
              class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
              hidden=""
            ></div>
            <div
              data-state="active"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-«r6f»-trigger-troubleshooting"
              id="radix-«r6f»-content-troubleshooting"
              tabindex="0"
              class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
            >
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
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
                      class="lucide lucide-circle-help h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    Troubleshooting &amp; FAQ
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Common issues and solutions
                  </div>
                </div>
                <div class="p-6 pt-0 space-y-6">
                  <div class="space-y-6">
                    <div class="border rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">
                        ❓ Can't receive registration email?
                      </h4>
                      <ul class="space-y-1 text-sm text-black-700">
                        <li>• Check spam/junk folder</li>
                        <li>• Verify email address spelling</li>
                        <li>• Wait 5-10 minutes for delivery</li>
                        <li>• Try different email provider</li>
                        <li>• Contact support if issue persists</li>
                      </ul>
                    </div>
                    <div class="border rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">
                        ❓ Forgot password?
                      </h4>
                      <ul class="space-y-1 text-sm text-black-700">
                        <li>• Use "Forgot Password" on login page</li>
                        <li>• Check email for reset link</li>
                        <li>• Link expires in 1 hour</li>
                        <li>• Create strong new password</li>
                        <li>• Contact support if no email received</li>
                      </ul>
                    </div>
                    <div class="border rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">
                        ❓ Account locked or suspended?
                      </h4>
                      <ul class="space-y-1 text-sm text-black-700">
                        <li>• Multiple failed login attempts</li>
                        <li>• Wait 15 minutes before retry</li>
                        <li>• Use password reset if needed</li>
                        <li>• Contact support for account issues</li>
                        <li>• Verify email address is confirmed</li>
                      </ul>
                    </div>
                    <div class="border rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">
                        ❓ Social login not working?
                      </h4>
                      <ul class="space-y-1 text-sm text-black-700">
                        <li>• Clear browser cache and cookies</li>
                        <li>• Disable ad blockers temporarily</li>
                        <li>• Try different browser</li>
                        <li>• Check social account permissions</li>
                        <li>• Use email login as alternative</li>
                      </ul>
                    </div>
                    <div class="border rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">
                        ❓ Profile information not saving?
                      </h4>
                      <ul class="space-y-1 text-sm text-black-700">
                        <li>• Check internet connection</li>
                        <li>• Fill all required fields</li>
                        <li>• Refresh page and try again</li>
                        <li>• Clear browser cache</li>
                        <li>• Contact support if issue continues</li>
                      </ul>
                    </div>
                  </div>
                  <div class="bg-orange-50 p-6 rounded-lg">
                    <h3 class="font-semibold text-orange-800 mb-3">
                      Need More Help?
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 class="font-medium text-orange-700 mb-2">
                          Contact Support
                        </h4>
                        <ul class="space-y-1 text-sm text-orange-600">
                          <li>📧 Email: support&#64;sanatannz.com</li>
                          <li>📞 Phone: +64 9 123 4567</li>
                          <li>💬 Live Chat: Available 9 AM - 6 PM</li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="font-medium text-orange-700 mb-2">
                          Community Help
                        </h4>
                        <ul class="space-y-1 text-sm text-orange-600">
                          <li>🗣️ Community Forum</li>
                          <li>📚 Knowledge Base</li>
                          <li>🎥 Video Tutorials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 text-center space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Ready to Get Started?
            </h3>
            <div class="flex flex-wrap justify-center gap-4">
              <a
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700"
                href="/register"
                >Create Account<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-right ml-2 h-4 w-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path></svg
              ></a>
              <a
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                href="/login"
                >Sign In</a
              >
              <a
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                href="/help"
                >Contact Support</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [], // Tailwind CSS classes are used, so no additional inline styles are needed.
})
export class UsermanualComponent {
  // Any component logic would go here
}
