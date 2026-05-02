export interface SortMetrics {
  algorithmId: string;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  category: 'divide-conquer' | 'comparison' | 'insertion' | 'database';
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  metrics: SortMetrics;
  defaultField: string;
  defaultOrder: string;
}

export const SORT_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'merge',
    name: 'Merge Sort',
    metrics: {
      algorithmId: 'merge',
      name: 'Merge Sort',
      description: 'Efficient, stable divide-and-conquer sorting algorithm. Recursively divides array and merges sorted halves.',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      spaceComplexity: 'O(n)',
      stable: true,
      category: 'divide-conquer',
    },
    defaultField: 'createdAt',
    defaultOrder: 'desc',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    metrics: {
      algorithmId: 'quick',
      name: 'Quick Sort',
      description: 'Fast in-place sorting using pivot partitioning. Average O(n log n) but worst O(n²).',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      spaceComplexity: 'O(log n)',
      stable: false,
      category: 'divide-conquer',
    },
    defaultField: 'createdAt',
    defaultOrder: 'desc',
  },
  {
    id: 'bubble',
    name: 'Bubble Sort',
    metrics: {
      algorithmId: 'bubble',
      name: 'Bubble Sort',
      description: 'Simple algorithm that repeatedly swaps adjacent elements. Good for teaching.',
      timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      spaceComplexity: 'O(1)',
      stable: true,
      category: 'insertion',
    },
    defaultField: 'createdAt',
    defaultOrder: 'desc',
  },
  {
    id: 'mongo',
    name: 'MongoDB Native',
    metrics: {
      algorithmId: 'mongo',
      name: 'MongoDB Native Sort',
      description: 'Database-level sorting using indexes. Most efficient for large datasets.',
      timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
      stable: true,
      category: 'database',
    },
    defaultField: 'createdAt',
    defaultOrder: 'desc',
  },
];

export function getAlgorithmById(id: string): AlgorithmInfo | undefined {
  return SORT_ALGORITHMS.find(algo => algo.id === id);
}