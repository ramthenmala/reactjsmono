// Routing and navigation types

export interface RouteParams {
  locale?: string;
}

export interface LocationState {
  from?: string;
}

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title?: string;
  requiresAuth?: boolean;
}

export interface NavigationConfig {
  routes: RouteConfig[];
  defaultLocale: string;
  supportedLocales: string[];
}