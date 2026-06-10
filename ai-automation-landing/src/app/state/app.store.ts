import { Injectable, computed, effect, signal } from '@angular/core';

import { AppState, AppTheme, NotificationItem, UserMetadata, initialAppState } from './app.state';

@Injectable()
export class AppStore {
  private readonly state = signal<AppState>(initialAppState);

  private notificationIdCounter = 0;

  readonly ui = computed(() => this.state().ui);

  readonly auth = computed(() => this.state().auth);

  readonly app = computed(() => this.state().app);

  readonly sidebarOpen = computed(() => this.ui().sidebarOpen);

  readonly theme = computed(() => this.ui().theme);

  readonly isAuthenticated = computed(() => this.auth().isAuthenticated);

  readonly user = computed(() => this.auth().user);

  readonly isLoading = computed(() => this.app().isLoading);

  readonly notifications = computed(() => this.app().notifications);

  readonly unreadNotificationsCount = computed(
    () => this.notifications().filter((notification) => !notification.read).length
  );

  readonly activeNotificationMessage = computed(
    () =>
      this.notifications().find((notification) => !notification.read)?.message ?? 'No notifications'
  );

  readonly hasActiveSession = computed(() => this.isAuthenticated() && !!this.user().id);

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      document.documentElement.dataset['theme'] = this.theme();
    });
  }

  private createNotificationId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    this.notificationIdCounter += 1;
    return `notification-${this.notificationIdCounter}`;
  }

  toggleSidebar(): void {
    this.state.update((current) => ({
      ...current,
      ui: {
        ...current.ui,
        sidebarOpen: !current.ui.sidebarOpen,
      },
    }));
  }

  setSidebarOpen(sidebarOpen: boolean): void {
    this.state.update((current) => ({
      ...current,
      ui: {
        ...current.ui,
        sidebarOpen,
      },
    }));
  }

  setTheme(theme: AppTheme): void {
    this.state.update((current) => ({
      ...current,
      ui: {
        ...current.ui,
        theme,
      },
    }));
  }

  setAuthenticated(user: UserMetadata): void {
    this.state.update((current) => ({
      ...current,
      auth: {
        isAuthenticated: true,
        user,
      },
    }));
  }

  logout(): void {
    this.state.update((current) => ({
      ...current,
      auth: initialAppState.auth,
    }));
  }

  setLoading(isLoading: boolean): void {
    this.state.update((current) => ({
      ...current,
      app: {
        ...current.app,
        isLoading,
      },
    }));
  }

  addNotification(message: string, level: NotificationItem['level'] = 'info'): void {
    const notification: NotificationItem = {
      id: this.createNotificationId(),
      message,
      level,
      read: false,
    };

    this.state.update((current) => ({
      ...current,
      app: {
        ...current.app,
        notifications: [notification, ...current.app.notifications],
      },
    }));
  }

  markNotificationRead(notificationId: string): void {
    this.state.update((current) => ({
      ...current,
      app: {
        ...current.app,
        notifications: current.app.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        ),
      },
    }));
  }

  clearNotifications(): void {
    this.state.update((current) => ({
      ...current,
      app: {
        ...current.app,
        notifications: [],
      },
    }));
  }

  seedDashboardDemo(): void {
    if (!this.isAuthenticated()) {
      this.setAuthenticated({
        id: 'demo-user',
        name: 'Automation Lead',
        email: 'lead@example.com',
        avatarUrl: null,
        role: 'admin',
      });
    }

    if (!this.notifications().length) {
      this.addNotification('Dashboard demo session initialized.', 'success');
    }
  }
}
