import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('notes/:count')
  @ApiOperation({ summary: 'Seed database with random notes' })
  async seedNotes(@Param('count') count: string) {
    const countNum = parseInt(count, 10);
    
    if (isNaN(countNum)) {
      return { success: false, message: 'Invalid count parameter' };
    }
    
    if (countNum > 10000) {
      return { success: false, message: 'Maximum 10000 notes allowed' };
    }
    
    return this.seedService.seedNotes(countNum);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all notes from database' })
  async clearNotes() {
    return this.seedService.clearAllNotes();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total note count' })
  async getCount() {
    const count = await this.seedService.getNoteCount();
    return { count };
  }
}