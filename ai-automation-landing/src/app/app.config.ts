import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpInterceptorService } from '@core/interceptors/http.interceptor';
import { AuthService } from '@core/services/auth.service';
import { routes } from './app.routes';
import { AppStore } from './state/app.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initialize();
    }),
    AppStore,
  ],
};
