import { SortedNote, SortStrategy } from './sort-algorithms';

export class QuickSort implements SortStrategy {
  /**
   * Quick Sort Implementation - O(n log n) average, O(n²) worst
   * In-place sorting using pivot partitioning
   * Not stable
   */
  sort(notes: SortedNote[], compareFn: (a: SortedNote, b: SortedNote) => number): SortedNote[] {
    if (notes.length <= 1) {
      return notes;
    }

    const result = [...notes];
    this.quickSortRecursive(result, 0, result.length - 1, compareFn);
    return result;
  }

  private quickSortRecursive(
    arr: SortedNote[],
    low: number,
    high: number,
    compareFn: (a: SortedNote, b: SortedNote) => number,
  ): void {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high, compareFn);
      this.quickSortRecursive(arr, low, pivotIndex - 1, compareFn);
      this.quickSortRecursive(arr, pivotIndex + 1, high, compareFn);
    }
  }

  private partition(
    arr: SortedNote[],
    low: number,
    high: number,
    compareFn: (a: SortedNote, b: SortedNote) => number,
  ): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
  }
}

export function createQuickSort(): SortStrategy {
  return new QuickSort();
}