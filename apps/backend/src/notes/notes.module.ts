import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NOTES_REPOSITORY } from './notes.constants';
import { NotesMemoryRepository } from './notes-memory.repository';
import { NotesMongooseRepository } from './notes-mongoose.repository';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note, NoteSchema } from './schemas/note.schema';

const useMongo = Boolean(process.env.MONGODB_URI);

@Module({
  imports: [
    ...(useMongo
      ? [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }])]
      : []),
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    useMongo
      ? {
          provide: NOTES_REPOSITORY,
          useClass: NotesMongooseRepository,
        }
      : {
          provide: NOTES_REPOSITORY,
          useClass: NotesMemoryRepository,
        },
  ],
})
export class NotesModule {}