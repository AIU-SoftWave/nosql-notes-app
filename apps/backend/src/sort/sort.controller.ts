import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SORT_ALGORITHMS, getAlgorithmById, SortMetrics } from '../utils/sort-metrics';

export interface SortAlgorithmResponse {
  algorithms: Array<{
    id: string;
    name: string;
    metrics: SortMetrics;
  }>;
}

export interface SingleAlgorithmResponse {
  id: string;
  name: string;
  metrics: SortMetrics;
}

@ApiTags('sort')
@Controller('sort')
export class SortController {
  @Get('algorithms')
  @ApiOperation({ summary: 'Get all available sorting algorithms with metrics' })
  getAlgorithms(): SortAlgorithmResponse {
    return {
      algorithms: SORT_ALGORITHMS.map(algo => ({
        id: algo.id,
        name: algo.name,
        metrics: algo.metrics,
      })),
    };
  }

  @Get('algorithms/:id')
  @ApiOperation({ summary: 'Get single sorting algorithm metrics' })
  getAlgorithm(@Param('id') id: string): SingleAlgorithmResponse | { error: string } {
    const algorithm = getAlgorithmById(id);
    
    if (!algorithm) {
      return { error: `Algorithm '${id}' not found` };
    }

    return {
      id: algorithm.id,
      name: algorithm.name,
      metrics: algorithm.metrics,
    };
  }
}