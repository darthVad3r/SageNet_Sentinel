import { Injectable, inject } from '@angular/core';

import { AppStore } from '../../state/app.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly appStore = inject(AppStore);

  isAuthenticated(): boolean {
    return this.appStore.isAuthenticated();
  }
}
