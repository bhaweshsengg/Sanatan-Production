import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { authInterceptor } from './app/Auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig, // spread existing config
  providers: [
    ...(appConfig.providers || []), // keep existing providers
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
});
