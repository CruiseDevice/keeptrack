/**
 * Optimistic update utilities for immediate UI updates.
 * These patterns allow the UI to update instantly before API confirmation,
 * providing a snappier user experience.
 */

/**
 * Creates an optimistic update by merging original data with partial updates.
 * Returns a new object with updates applied, leaving the original unchanged.
 *
 * @param original - The original data object
 * @param updates - Partial updates to apply
 * @returns A new object with updates merged in
 *
 * @example
 * const original = { id: 1, name: 'Task', status: 'todo' };
 * const updated = createOptimisticUpdate(original, { status: 'done' });
 * // Result: { id: 1, name: 'Task', status: 'done' }
 */
export function createOptimisticUpdate<T extends object>(
  original: T,
  updates: Partial<T>
): T {
  return {
    ...original,
    ...updates
  } as T;
}

/**
 * Creates an optimistic update using a constructor function.
 * Useful when your domain model uses classes with constructors.
 *
 * @param Constructor - A class constructor that accepts an initializer object
 * @param original - The original instance
 * @param updates - Partial updates to apply
 * @returns A new instance with updates applied
 *
 * @example
 * class Project {
 *   constructor(initializer?: any) { ... }
 * }
 * const original = new Project({ id: 1, name: 'Task' });
 * const updated = createOptimisticUpdateFromConstructor(Project, original, { name: 'Updated' });
 */
export function createOptimisticUpdateFromConstructor<T extends object>(
  Constructor: new (initializer?: any) => T,
  original: T,
  updates: Partial<T>
): T {
  return new Constructor({
    ...original,
    ...updates
  });
}

/**
 * Updates an item in an array optimistically.
 * Returns a new array with the updated item, leaving the original array unchanged.
 *
 * @param items - The original array of items
 * @param itemId - The ID of the item to update
 * @param getId - A function to extract the ID from an item
 * @param updates - Partial updates to apply
 * @returns A new array with the updated item
 *
 * @example
 * const tasks = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
 * const updated = updateItemInArray(tasks, 1, t => t.id, { name: 'Updated' });
 * // Result: [{ id: 1, name: 'Updated' }, { id: 2, name: 'B' }]
 */
export function updateItemInArray<T extends object>(
  items: T[],
  itemId: any,
  getId: (item: T) => any,
  updates: Partial<T>
): T[] {
  return items.map(item =>
    getId(item) === itemId
      ? createOptimisticUpdate(item, updates)
      : item
  );
}

/**
 * A hook-like result type for optimistic updates that tracks pending state
 */
export interface OptimisticState<T> {
  /** The current data including any pending optimistic updates */
  data: T;
  /** Whether there's a pending optimistic update */
  isPending: boolean;
  /** The last committed (server-confirmed) data */
  committedData: T;
}

/**
 * Creates the initial state for an optimistic update
 */
export function createInitialOptimisticState<T>(data: T): OptimisticState<T> {
  return {
    data,
    isPending: false,
    committedData: data
  };
}
