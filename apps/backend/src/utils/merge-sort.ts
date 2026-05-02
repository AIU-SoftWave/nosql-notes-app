import { SortedNote, SortStrategy } from './sort-algorithms';

export class MergeSort implements SortStrategy {
  /**
   * Merge Sort Implementation - O(n log n) time complexity
   * Divide and conquer algorithm
   * Stable sort (preserves relative order of equal elements)
   */
  sort(notes: SortedNote[], compareFn: (a: SortedNote, b: SortedNote) => number): SortedNote[] {
    if (notes.length <= 1) {
      return notes;
    }

    const middle = Math.floor(notes.length / 2);
    const left = this.sort(notes.slice(0, middle), compareFn);
    const right = this.sort(notes.slice(middle), compareFn);

    return this.merge(left, right, compareFn);
  }

  private merge(
    left: SortedNote[],
    right: SortedNote[],
    compareFn: (a: SortedNote, b: SortedNote) => number,
  ): SortedNote[] {
    const result: SortedNote[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      const compareResult = compareFn(left[leftIndex], right[rightIndex]);

      if (compareResult <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    // Concatenate remaining elements
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }
}

/**
 * Factory function to get MergeSort instance
 */
export function createMergeSort(): SortStrategy {
  return new MergeSort();
}