export type AppTheme = 'light' | 'dark' | 'system';

export interface UserMetadata {
  id: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string | null;
}

export interface NotificationItem {
  id: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface UiState {
  sidebarOpen: boolean;
  theme: AppTheme;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserMetadata;
}

export interface AppStatusState {
  isLoading: boolean;
  notifications: NotificationItem[];
}

export interface AppState {
  ui: UiState;
  auth: AuthState;
  app: AppStatusState;
}

export const initialAppState: AppState = {
  ui: {
    sidebarOpen: false,
    theme: 'light',
  },
  auth: {
    isAuthenticated: false,
    user: {
      id: null,
      name: null,
      email: null,
      avatarUrl: null,
      role: null,
    },
  },
  app: {
    isLoading: false,
    notifications: [],
  },
};
