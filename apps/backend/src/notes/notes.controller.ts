import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    const note = await this.notesService.create(createNoteDto);
    return { success: true, data: note, message: 'Note created successfully' };
  }

  @Get()
  async findAll() {
    const notes = await this.notesService.findAll();
    return { success: true, data: notes };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const note = await this.notesService.findOne(id);
    return { success: true, data: note };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const note = await this.notesService.update(id, updateNoteDto);
    return { success: true, data: note, message: 'Note updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.notesService.remove(id);
    return { success: true, data: result, message: 'Note deleted successfully' };
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const note = await this.notesService.addComment(id, createCommentDto);
    return { success: true, data: note, message: 'Comment added successfully' };
  }

  @Patch(':id/view')
  async incrementViews(@Param('id') id: string) {
    const note = await this.notesService.incrementViews(id);
    return { success: true, data: note, message: 'View count updated' };
  }
}