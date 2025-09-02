// Common types used across the application

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithId {
  id: string;
}

export interface WithTitle {
  title: string;
}

export interface WithOptionalTitle {
  title?: string;
}

export interface WithDescription {
  description: string;
}

export interface WithOptionalDescription {
  description?: string;
}

export interface Translatable {
  titleKey: string;
  subtitleKey?: string;
  descriptionKey?: string;
}

export interface NavigationItem extends WithId {
  label: string;
  href: string;
  current?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  items?: NavigationItem[];
}

// Generic API response types
export interface ApiResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  value: T;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
}

export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type ClickHandler = EventHandler<React.MouseEvent>;
export type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>;
export type SubmitHandler = EventHandler<React.FormEvent>;