/**
 * Shared API and common application types.
 * These types are used across multiple features and should remain domain-agnostic.
 */

// ============ API Types ============

/**
 * HTTP error information from failed API responses
 */
export interface HttpErrorInfo {
  status: number;
  statusText: string;
  url: string;
}

/**
 * Standard API error with message and optional details
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Generic API response wrapper for successful requests
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers?: Headers;
}

/**
 * Generic paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Generic API client interface for CRUD operations
 */
export interface ApiClient<T, TCreate, TUpdate = Partial<TCreate>> {
  getAll(): Promise<T[]>;
  get(id: string | number): Promise<T>;
  create(entity: TCreate): Promise<T>;
  update(id: string | number, updates: TUpdate): Promise<T>;
  delete(id: string | number): Promise<void>;
}

// ============ Common Domain Types ============

/**
 * Base entity type with ID
 */
export interface Entity {
  id: string | number;
}

/**
 * Timestamps for entities that track creation and updates
 */
export interface Timestamps {
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Soft delete marker for entities that support deletion
 */
export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date | string;
}

/**
 * Active status for entities that can be enabled/disabled
 */
export interface Activatable {
  isActive: boolean;
}

// ============ Common Application Types ============

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Resource state with loading, data, and error tracking
 * Common pattern for managing async resources in React
 */
export interface ResourceState<T> {
  status: LoadingState;
  data: T | null;
  error: Error | null;
}

/**
 * Creates an initial resource state
 */
export function createInitialResourceState<T>(): ResourceState<T> {
  return {
    status: 'idle',
    data: null,
    error: null,
  };
}

/**
 * Creates a loading resource state
 */
export function createLoadingResourceState<T>(data?: T | null): ResourceState<T> {
  return {
    status: 'loading',
    data: data ?? null,
    error: null,
  };
}

/**
 * Creates a success resource state
 */
export function createSuccessResourceState<T>(data: T): ResourceState<T> {
  return {
    status: 'success',
    data,
    error: null,
  };
}

/**
 * Creates an error resource state
 */
export function createErrorResourceState<T>(error: Error, data?: T | null): ResourceState<T> {
  return {
    status: 'error',
    data: data ?? null,
    error,
  };
}

// ============ Utility Types ============

/**
 * Makes all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes specific properties required
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Omits specific properties from a type
 */
export type OmitProps<T, K extends keyof T> = Omit<T, K>;

/**
 * Picks specific properties from a type
 */
export type PickProps<T, K extends keyof T> = Pick<T, K>;

/**
 * A type that represents a value that may or may not be there
 * Useful for discriminating between "no value" and "value is null/undefined"
 */
export type Maybe<T> = T | null | undefined;

/**
 * A value that is definitely present (not null or undefined)
 */
export type Defined<T> = T extends null | undefined ? never : T;

/**
 * Form field validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Generic form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

/**
 * Sort direction for list operations
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Generic sort configuration
 */
export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

/**
 * Generic filter configuration
 */
export interface FilterConfig<T> {
  field: keyof T;
  operator: 'eq' | 'neq' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
  value: unknown;
}
