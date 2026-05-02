import { SortedNote, SortStrategy, CompareFunction } from './sort-algorithms';
import { MergeSort, createMergeSort } from './merge-sort';
import { QuickSort, createQuickSort } from './quick-sort';
import { BubbleSort, createBubbleSort } from './bubble-sort';

describe('Sorting Algorithms', () => {
  // Helper function to create test notes
  const createNote = (overrides: Partial<SortedNote> = {}): SortedNote => ({
    id: '1',
    userId: 'user1',
    username: 'testuser',
    title: 'Test Note',
    content: 'Content',
    tags: [],
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    commentCount: 0,
    views: 0,
    ...overrides,
  });

  // Test data
  const unsortedNotes: SortedNote[] = [
    createNote({ id: '3', title: 'C Note', views: 30, createdAt: new Date('2024-01-03') }),
    createNote({ id: '1', title: 'A Note', views: 10, createdAt: new Date('2024-01-01') }),
    createNote({ id: '2', title: 'B Note', views: 20, createdAt: new Date('2024-01-02') }),
  ];

  const sortedByTitleAsc: SortedNote[] = [
    createNote({ id: '1', title: 'A Note', views: 10, createdAt: new Date('2024-01-01') }),
    createNote({ id: '2', title: 'B Note', views: 20, createdAt: new Date('2024-01-02') }),
    createNote({ id: '3', title: 'C Note', views: 30, createdAt: new Date('2024-01-03') }),
  ];

  const sortedByViewsDesc: SortedNote[] = [
    createNote({ id: '3', title: 'C Note', views: 30, createdAt: new Date('2024-01-03') }),
    createNote({ id: '2', title: 'B Note', views: 20, createdAt: new Date('2024-01-02') }),
    createNote({ id: '1', title: 'A Note', views: 10, createdAt: new Date('2024-01-01') }),
  ];

  const compareByTitleAsc: CompareFunction = (a, b) => a.title.localeCompare(b.title);
  const compareByViewsDesc: CompareFunction = (a, b) => b.views - a.views;
  const compareByDateDesc: CompareFunction = (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  describe('MergeSort', () => {
    let sorter: SortStrategy;

    beforeEach(() => {
      sorter = new MergeSort();
    });

    it('should be created via factory function', () => {
      const factorySorter = createMergeSort();
      expect(factorySorter).toBeInstanceOf(MergeSort);
    });

    it('should sort by title ascending', () => {
      const result = sorter.sort([...unsortedNotes], compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should sort by views descending', () => {
      const result = sorter.sort([...unsortedNotes], compareByViewsDesc);
      expect(result.map(n => n.views)).toEqual([30, 20, 10]);
    });

    it('should handle empty array', () => {
      const result = sorter.sort([], compareByTitleAsc);
      expect(result).toEqual([]);
    });

    it('should handle single element', () => {
      const single = [createNote({ id: '1', title: 'Only' })];
      const result = sorter.sort(single, compareByTitleAsc);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Only');
    });

    it('should be stable (preserve order of equal elements)', () => {
      const notesWithDuplicates: SortedNote[] = [
        createNote({ id: '1', title: 'Same', views: 10 }),
        createNote({ id: '2', title: 'Same', views: 20 }),
        createNote({ id: '3', title: 'Same', views: 30 }),
      ];
      const result = sorter.sort([...notesWithDuplicates], compareByTitleAsc);
      // Should preserve original order for equal keys (stable sort property)
      expect(result.map(n => n.id)).toEqual(['1', '2', '3']);
    });

    it('should handle large datasets efficiently', () => {
      const largeArray: SortedNote[] = Array.from({ length: 1000 }, (_, i) =>
        createNote({ id: `${i}`, title: `Note ${999 - i}`, views: 999 - i }),
      );
      const startTime = Date.now();
      const result = sorter.sort(largeArray, compareByTitleAsc);
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(result[0].title).toBe('Note 0');
      expect(result[999].title).toBe('Note 999');
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });

  describe('QuickSort', () => {
    let sorter: SortStrategy;

    beforeEach(() => {
      sorter = new QuickSort();
    });

    it('should be created via factory function', () => {
      const factorySorter = createQuickSort();
      expect(factorySorter).toBeInstanceOf(QuickSort);
    });

    it('should sort by title ascending', () => {
      const result = sorter.sort([...unsortedNotes], compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should sort by views descending', () => {
      const result = sorter.sort([...unsortedNotes], compareByViewsDesc);
      expect(result.map(n => n.views)).toEqual([30, 20, 10]);
    });

    it('should handle empty array', () => {
      const result = sorter.sort([], compareByTitleAsc);
      expect(result).toEqual([]);
    });

    it('should handle single element', () => {
      const single = [createNote({ id: '1', title: 'Only' })];
      const result = sorter.sort(single, compareByTitleAsc);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Only');
    });

    it('should handle duplicate values', () => {
      const notesWithDuplicates: SortedNote[] = [
        createNote({ id: '1', title: 'Same', views: 10 }),
        createNote({ id: '2', title: 'Same', views: 20 }),
        createNote({ id: '3', title: 'Same', views: 30 }),
      ];
      const result = sorter.sort([...notesWithDuplicates], compareByTitleAsc);
      expect(result).toHaveLength(3);
      expect(result.every(n => n.title === 'Same')).toBe(true);
    });

    it('should handle already sorted array', () => {
      const result = sorter.sort([...sortedByTitleAsc], compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should handle reverse sorted array', () => {
      const reverseSorted = [...sortedByTitleAsc].reverse();
      const result = sorter.sort(reverseSorted, compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should handle large datasets efficiently', () => {
      const largeArray: SortedNote[] = Array.from({ length: 1000 }, (_, i) =>
        createNote({ id: `${i}`, title: `Note ${999 - i}`, views: 999 - i }),
      );
      const startTime = Date.now();
      const result = sorter.sort(largeArray, compareByTitleAsc);
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(result[0].title).toBe('Note 0');
      expect(result[999].title).toBe('Note 999');
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('BubbleSort', () => {
    let sorter: SortStrategy;

    beforeEach(() => {
      sorter = new BubbleSort();
    });

    it('should be created via factory function', () => {
      const factorySorter = createBubbleSort();
      expect(factorySorter).toBeInstanceOf(BubbleSort);
    });

    it('should sort by title ascending', () => {
      const result = sorter.sort([...unsortedNotes], compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should sort by views descending', () => {
      const result = sorter.sort([...unsortedNotes], compareByViewsDesc);
      expect(result.map(n => n.views)).toEqual([30, 20, 10]);
    });

    it('should handle empty array', () => {
      const result = sorter.sort([], compareByTitleAsc);
      expect(result).toEqual([]);
    });

    it('should handle single element', () => {
      const single = [createNote({ id: '1', title: 'Only' })];
      const result = sorter.sort(single, compareByTitleAsc);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Only');
    });

    it('should be stable (preserve order of equal elements)', () => {
      const notesWithDuplicates: SortedNote[] = [
        createNote({ id: '1', title: 'Same', views: 10 }),
        createNote({ id: '2', title: 'Same', views: 20 }),
        createNote({ id: '3', title: 'Same', views: 30 }),
      ];
      const result = sorter.sort([...notesWithDuplicates], compareByTitleAsc);
      expect(result.map(n => n.id)).toEqual(['1', '2', '3']);
    });

    it('should early exit on already sorted array', () => {
      // Bubble sort has optimization to exit early if no swaps needed
      const sorted = [...sortedByTitleAsc];
      const result = sorter.sort(sorted, compareByTitleAsc);
      expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
    });

    it('should handle small datasets efficiently', () => {
      const smallArray: SortedNote[] = Array.from({ length: 100 }, (_, i) =>
        createNote({ id: `${i}`, title: `Note ${99 - i}`, views: 99 - i }),
      );
      const startTime = Date.now();
      const result = sorter.sort(smallArray, compareByTitleAsc);
      const endTime = Date.now();

      expect(result).toHaveLength(100);
      expect(result[0].title).toBe('Note 0');
      expect(result[99].title).toBe('Note 99');
      // Bubble sort is O(n²), so 100 elements should still be fast
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Algorithm Comparison', () => {
    it('all algorithms should produce the same sorted result', () => {
      const mergeSort = new MergeSort();
      const quickSort = new QuickSort();
      const bubbleSort = new BubbleSort();

      const mergeResult = mergeSort.sort([...unsortedNotes], compareByTitleAsc);
      const quickResult = quickSort.sort([...unsortedNotes], compareByTitleAsc);
      const bubbleResult = bubbleSort.sort([...unsortedNotes], compareByTitleAsc);

      expect(mergeResult.map(n => n.title)).toEqual(quickResult.map(n => n.title));
      expect(quickResult.map(n => n.title)).toEqual(bubbleResult.map(n => n.title));
    });

    it('all algorithms should handle date sorting correctly', () => {
      const mergeSort = new MergeSort();
      const quickSort = new QuickSort();
      const bubbleSort = new BubbleSort();

      const mergeResult = mergeSort.sort([...unsortedNotes], compareByDateDesc);
      const quickResult = quickSort.sort([...unsortedNotes], compareByDateDesc);
      const bubbleResult = bubbleSort.sort([...unsortedNotes], compareByDateDesc);

      const expectedDates = ['2024-01-03', '2024-01-02', '2024-01-01'];
      expect(mergeResult.map(n => n.createdAt.toISOString().split('T')[0])).toEqual(expectedDates);
      expect(quickResult.map(n => n.createdAt.toISOString().split('T')[0])).toEqual(expectedDates);
      expect(bubbleResult.map(n => n.createdAt.toISOString().split('T')[0])).toEqual(expectedDates);
    });

    it('all algorithms should not mutate original array', () => {
      const mergeSort = new MergeSort();
      const quickSort = new QuickSort();
      const bubbleSort = new BubbleSort();

      const original = [...unsortedNotes];

      mergeSort.sort(unsortedNotes, compareByTitleAsc);
      expect(unsortedNotes).toEqual(original);

      quickSort.sort(unsortedNotes, compareByTitleAsc);
      expect(unsortedNotes).toEqual(original);

      bubbleSort.sort(unsortedNotes, compareByTitleAsc);
      expect(unsortedNotes).toEqual(original);
    });
  });

  describe('Edge Cases', () => {
    const algorithms: { name: string; sorter: SortStrategy }[] = [
      { name: 'MergeSort', sorter: new MergeSort() },
      { name: 'QuickSort', sorter: new QuickSort() },
      { name: 'BubbleSort', sorter: new BubbleSort() },
    ];

    algorithms.forEach(({ name, sorter }) => {
      describe(`${name} edge cases`, () => {
        it('should handle notes with special characters in title', () => {
          const notes: SortedNote[] = [
            createNote({ id: '1', title: 'Zebra' }),
            createNote({ id: '2', title: '🚀 Rocket' }),
            createNote({ id: '3', title: 'Apple' }),
          ];
          const result = sorter.sort([...notes], compareByTitleAsc);
          expect(result).toHaveLength(3);
        });

        it('should handle notes with zero views', () => {
          const notes: SortedNote[] = [
            createNote({ id: '1', title: 'A', views: 0 }),
            createNote({ id: '2', title: 'B', views: 5 }),
            createNote({ id: '3', title: 'C', views: 0 }),
          ];
          const result = sorter.sort([...notes], compareByViewsDesc);
          expect(result[0].views).toBe(5);
          expect(result[1].views).toBe(0);
          expect(result[2].views).toBe(0);
        });

        it('should handle notes with many comments', () => {
          const notes: SortedNote[] = [
            createNote({ id: '1', title: 'A', commentCount: 100 }),
            createNote({ id: '2', title: 'B', commentCount: 0 }),
            createNote({ id: '3', title: 'C', commentCount: 50 }),
          ];
          const compareByComments: CompareFunction = (a, b) =>
            b.commentCount - a.commentCount;
          const result = sorter.sort([...notes], compareByComments);
          expect(result.map(n => n.commentCount)).toEqual([100, 50, 0]);
        });

        it('should handle two-element array', () => {
          const notes: SortedNote[] = [
            createNote({ id: '2', title: 'B' }),
            createNote({ id: '1', title: 'A' }),
          ];
          const result = sorter.sort([...notes], compareByTitleAsc);
          expect(result.map(n => n.title)).toEqual(['A', 'B']);
        });
      });
    });
  });
});
