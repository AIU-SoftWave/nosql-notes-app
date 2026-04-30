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
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiCreatedResponse({ description: 'The note was created successfully.' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiOkResponse({ description: 'A list of notes.' })
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiOkResponse({ description: 'The requested note.' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiOkResponse({ description: 'The note was updated successfully.' })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiOkResponse({ description: 'The note was deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
