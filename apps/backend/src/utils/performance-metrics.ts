export interface SortPerformanceMetrics {
  algorithmId: string;
  algorithmName: string;
  executionTimeMs: number;
  dataSize: number;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  performance: SortPerformanceMetrics;
}

export function calculatePerformance(
  algorithmId: string,
  algorithmName: string,
  startTime: bigint,
  dataSize: number,
): SortPerformanceMetrics {
  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1_000_000;

  const complexityMap: Record<string, { time: string; space: string; stable: boolean }> = {
    merge: { time: 'O(n log n)', space: 'O(n)', stable: true },
    quick: { time: 'O(n log n) avg', space: 'O(log n)', stable: false },
    bubble: { time: 'O(n²)', space: 'O(1)', stable: true },
    mongo: { time: 'O(log n)', space: 'O(1)', stable: true },
  };

  const complexity = complexityMap[algorithmId] || { time: 'Unknown', space: 'Unknown', stable: false };

  return {
    algorithmId,
    algorithmName,
    executionTimeMs: Math.round(executionTimeMs * 100) / 100,
    dataSize,
    timeComplexity: complexity.time,
    spaceComplexity: complexity.space,
    stable: complexity.stable,
  };
}