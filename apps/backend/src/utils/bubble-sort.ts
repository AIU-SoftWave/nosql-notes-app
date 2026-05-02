import { SortedNote, SortStrategy } from './sort-algorithms';

export class BubbleSort implements SortStrategy {
  /**
   * Bubble Sort Implementation - O(n²)
   * Simple comparison-based algorithm
   * Stable and in-place
   */
  sort(notes: SortedNote[], compareFn: (a: SortedNote, b: SortedNote) => number): SortedNote[] {
    const result = [...notes];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (compareFn(result[j], result[j + 1]) > 0) {
          const temp = result[j];
          result[j] = result[j + 1];
          result[j + 1] = temp;
          swapped = true;
        }
      }

      if (!swapped) {
        break;
      }
    }

    return result;
  }
}

export function createBubbleSort(): SortStrategy {
  return new BubbleSort();
}