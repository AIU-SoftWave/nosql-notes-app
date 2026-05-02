import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export type SortField = 'createdAt' | 'updatedAt' | 'title' | 'views' | 'commentCount';
export type SortOrder = 'asc' | 'desc';

export class SortOption {
  @ApiProperty({ enum: ['createdAt', 'updatedAt', 'title', 'views', 'commentCount'] })
  @IsString()
  field: SortField = 'createdAt';

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsString()
  order: SortOrder = 'desc';
}

export interface SortedNote {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  views: number;
}

export type CompareFunction = (a: SortedNote, b: SortedNote) => number;

export interface SortStrategy {
  sort(notes: SortedNote[], compareFn: CompareFunction): SortedNote[];
}