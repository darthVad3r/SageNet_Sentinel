import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { readBackendApiBaseUrl } from '../services/runtime-config';

/**
 * HTTP Interceptor placeholder
 * Handles global HTTP request/response transformations
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken || !this.isApiRequest(req.url)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  }

  private isApiRequest(url: string): boolean {
    if (url.startsWith('/api')) {
      return true;
    }

    const backendApiBaseUrl = readBackendApiBaseUrl();
    if (backendApiBaseUrl && url.startsWith(`${backendApiBaseUrl}/api`)) {
      return true;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }

    if (typeof globalThis === 'undefined' || !globalThis.location?.origin) {
      return false;
    }

    return url.startsWith(`${globalThis.location.origin}/api`);
  }
}
