import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotesService } from './notes.service';
import { NormalizeTagsPipe } from './pipes/normalize-tags.pipe';
import { FindAllNotesDto } from './dto/findAll.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserDocument } from '../entities/user.entity';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiCreatedResponse({ description: 'The note was created successfully.' })
  create(@Body(NormalizeTagsPipe) createNoteDto: CreateNoteDto, @Request() req: any) {
    return this.notesService.create(createNoteDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notes with pagination and performance metrics' })
  @ApiOkResponse({ description: 'A list of notes with pagination.' })
  findAll(@Query() findAllNotesDto: FindAllNotesDto, @Request() req: any) {
    const page = findAllNotesDto.page ?? 1;
    const limit = findAllNotesDto.limit ?? 10;
    const userId = req?.user?.id;
    
    return this.notesService.findAll(
      findAllNotesDto.tag,
      findAllNotesDto.search,
      findAllNotesDto.sort,
      findAllNotesDto.algorithm,
      page,
      limit,
      userId,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get statistics about notes' })
  @ApiOkResponse({ description: 'Statistics about all notes.' })
  getStats() {
    return this.notesService.getStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity feed' })
  @ApiOkResponse({ description: 'Recent notes and comments activity.' })
  getActivity(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.notesService.getActivity(parsedLimit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiOkResponse({ description: 'The requested note.' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.notesService.findOne(id, req?.user?.id);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a note' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: 'The comment was added successfully.' })
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    return this.notesService.addComment(id, createCommentDto, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiOkResponse({ description: 'The note was updated successfully.' })
  update(
    @Param('id') id: string,
    @Body(NormalizeTagsPipe) updateNoteDto: UpdateNoteDto,
    @Request() req: any,
  ) {
    return this.notesService.update(id, updateNoteDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiOkResponse({ description: 'The note was deleted successfully.' })
  delete(@Param('id') id: string, @Request() req: any) {
    return this.notesService.delete(id, req.user);
  }
}