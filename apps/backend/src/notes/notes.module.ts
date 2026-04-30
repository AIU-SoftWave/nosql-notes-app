import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Note } from '../entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { ObjectId } from 'mongodb';

class InMemoryNoteRepository {
  private store: any[] = [];

  create(dto: any) {
    const id = new ObjectId();
    return { id, createdAt: new Date(), updatedAt: new Date(), ...dto };
  }

  async save(note: any) {
    const idx = this.store.findIndex((n) => String(n.id) === String(note.id));
    if (idx === -1) {
      this.store.unshift(note);
    } else {
      this.store[idx] = { ...this.store[idx], ...note, updatedAt: new Date() };
    }
    return note;
  }

  async find(opts?: any) {
    return this.store;
  }

  async findOne(opts: any) {
    const id = opts?.where?.id;
    if (!id) return null;
    return this.store.find((n) => String(n.id) === String(id));
  }

  async delete(id: any) {
    const before = this.store.length;
    this.store = this.store.filter((n) => String(n.id) !== String(id));
    return { affected: before - this.store.length };
  }
}

const createInMemoryProvider = (): Provider => ({
  provide: getRepositoryToken(Note),
  useClass: InMemoryNoteRepository,
});

const disableDb = process.env.DISABLE_DB === 'true';

@Module({
  imports: disableDb ? [] : [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: disableDb ? [createInMemoryProvider(), NotesService] : [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
