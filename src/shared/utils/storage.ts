/**
 * Generic localStorage utilities for persistent data storage.
 * Provides type-safe wrappers around localStorage operations with error handling.
 */

/**
 * Default configuration for storage operations
 */
export interface StorageConfig<T> {
  key: string;
  deserialize?: (data: string) => T;
  serialize?: (value: T) => string;
}

/**
 * Save data to localStorage with error handling
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export function saveToLocalStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 * @param key - The localStorage key
 * @returns The parsed value or null if not found/error
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error(`Failed to load from localStorage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Check if a key exists in localStorage
 * @param key - The localStorage key to check
 * @returns true if key exists and equals 'true'
 */
export function hasFlag(key: string): boolean {
  return localStorage.getItem(key) === 'true';
}

/**
 * Set a boolean flag in localStorage
 * @param key - The localStorage key
 * @param value - The boolean value to store
 */
export function setFlag(key: string, value: boolean): void {
  localStorage.setItem(key, String(value));
}

/**
 * Remove a specific item from localStorage
 * @param key - The localStorage key to remove
 */
export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clear multiple items from localStorage
 * @param keys - Array of keys to remove
 */
export function clearItems(...keys: string[]): void {
  keys.forEach(key => localStorage.removeItem(key));
}

/**
 * Generic storage class for typed localStorage operations
 */
export class TypedStorage<T> {
  constructor(
    private readonly key: string,
    private readonly reviver?: (key: string, value: any) => any
  ) {}

  save(value: T): boolean {
    return saveToLocalStorage(this.key, value);
  }

  load(): T | null {
    return loadFromLocalStorage<T>(this.key);
  }

  remove(): void {
    removeItem(this.key);
  }
}
