import { TestBed } from '@angular/core/testing';
import { AppStore } from './app.store';

describe('AppStore', () => {
  let store: AppStore;

  const flushPendingEffects = (): void => {
    (TestBed as unknown as { flushEffects?: () => void }).flushEffects?.();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStore],
    });
    document.documentElement.removeAttribute('data-theme');
    store = TestBed.inject(AppStore);
    flushPendingEffects();
  });

  it('should toggle sidebarOpen state', () => {
    expect(store.sidebarOpen()).toBe(false);

    store.toggleSidebar();
    expect(store.sidebarOpen()).toBe(true);

    store.toggleSidebar();
    expect(store.sidebarOpen()).toBe(false);
  });

  it('should set theme and sync data-theme on documentElement', () => {
    expect(store.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');

    store.setTheme('dark');
    flushPendingEffects();
    expect(store.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');

    store.setTheme('system');
    flushPendingEffects();
    expect(store.theme()).toBe('system');
    expect(document.documentElement.dataset['theme']).toBe('system');
  });

  it('should add notifications and update derived selectors', () => {
    expect(store.notifications().length).toBe(0);
    expect(store.unreadNotificationsCount()).toBe(0);
    expect(store.activeNotificationMessage()).toBe('No notifications');

    store.addNotification('First notice');

    expect(store.notifications().length).toBe(1);
    expect(store.unreadNotificationsCount()).toBe(1);
    expect(store.activeNotificationMessage()).toBe('First notice');
  });

  it('should mark a notification as read and recalculate unread selectors', () => {
    store.addNotification('First');
    store.addNotification('Second');

    expect(store.unreadNotificationsCount()).toBe(2);
    expect(store.activeNotificationMessage()).toBe('Second');

    const newestNotificationId = store.notifications()[0].id;
    store.markNotificationRead(newestNotificationId);

    expect(store.unreadNotificationsCount()).toBe(1);
    expect(store.activeNotificationMessage()).toBe('First');
  });

  it('should clear notifications and reset derived notification state', () => {
    store.addNotification('To be cleared');
    expect(store.unreadNotificationsCount()).toBe(1);

    store.clearNotifications();

    expect(store.notifications().length).toBe(0);
    expect(store.unreadNotificationsCount()).toBe(0);
    expect(store.activeNotificationMessage()).toBe('No notifications');
  });

  it('should seed dashboard demo auth state and success notification when state is empty', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.notifications().length).toBe(0);

    store.seedDashboardDemo();

    expect(store.isAuthenticated()).toBe(true);
    expect(store.user().id).toBe('demo-user');
    expect(store.user().name).toBe('Automation Lead');
    expect(store.hasActiveSession()).toBe(true);
    expect(store.notifications().length).toBe(1);
    expect(store.notifications()[0].level).toBe('success');
    expect(store.notifications()[0].message).toBe('Dashboard demo session initialized.');
  });

  it('should not duplicate demo notification when seeding twice', () => {
    store.seedDashboardDemo();
    store.seedDashboardDemo();

    expect(store.notifications().length).toBe(1);
  });
});
