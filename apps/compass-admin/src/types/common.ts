// Common types used across the application

export interface IBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface IWithId {
  id: string;
}

export interface IWithTitle {
  title: string;
}

export interface IWithOptionalTitle {
  title?: string;
}

export interface IWithDescription {
  description: string;
}

export interface IWithOptionalDescription {
  description?: string;
}

export interface ITranslatable {
  titleKey: string;
  subtitleKey?: string;
  descriptionKey?: string;
}

export interface INavigationItem extends IWithId {
  label: string;
  href: string;
  current?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  items?: INavigationItem[];
}

// Generic API response types
export interface IApiResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface IFormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  value: T;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
}

export interface IFormState<T = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Event handler types
export type TEventHandler<T = Event> = (event: T) => void;
export type TClickHandler = TEventHandler<React.MouseEvent>;
export type TChangeHandler = TEventHandler<
  React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
>;
export type TSubmitHandler = TEventHandler<React.FormEvent>;
