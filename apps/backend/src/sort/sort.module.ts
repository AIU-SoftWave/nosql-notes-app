import { Module } from '@nestjs/common';
import { SortController } from './sort.controller';

@Module({
  controllers: [SortController],
})
export class SortModule {}