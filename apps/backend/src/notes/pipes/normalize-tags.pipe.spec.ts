import { NormalizeTagsPipe } from './normalize-tags.pipe';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

describe('NormalizeTagsPipe', () => {
  let pipe: NormalizeTagsPipe;

  beforeEach(() => {
    pipe = new NormalizeTagsPipe();
  });

  describe('CreateNoteDto', () => {
    it('should normalize tags to lowercase', () => {
      const dto: CreateNoteDto = {
        title: 'Test',
        content: 'Content',
        tags: ['UPPER', 'MiXeD', 'lower'],
      };

      const result = pipe.transform(dto);

      expect(result.tags).toEqual(['upper', 'mixed', 'lower']);
    });

    it('should remove duplicate tags', () => {
      const dto: CreateNoteDto = {
        title: 'Test',
        content: 'Content',
        tags: ['tag', 'TAG', 'Tag', 'tag'],
      };

      const result = pipe.transform(dto);

      expect(result.tags).toEqual(['tag']);
    });

    it('should handle empty tags array', () => {
      const dto: CreateNoteDto = {
        title: 'Test',
        content: 'Content',
        tags: [],
      };

      const result = pipe.transform(dto);

      expect(result.tags).toEqual([]);
    });

    it('should handle undefined tags', () => {
      const dto: CreateNoteDto = {
        title: 'Test',
        content: 'Content',
      };

      const result = pipe.transform(dto);

      expect(result.tags).toBeUndefined();
    });

    it('should handle mixed tags without duplicates', () => {
      const dto: CreateNoteDto = {
        title: 'Test',
        content: 'Content',
        tags: ['work', 'personal', 'WORK', 'urgent'],
      };

      const result = pipe.transform(dto);

      expect(result.tags).toEqual(['work', 'personal', 'urgent']);
    });
  });

  describe('UpdateNoteDto', () => {
    it('should normalize update tags', () => {
      const dto: UpdateNoteDto = {
        tags: ['Update', 'UPDATE'],
      };

      const result = pipe.transform(dto);

      expect(result.tags).toEqual(['update']);
    });

    it('should not modify other fields', () => {
      const dto: UpdateNoteDto = {
        title: 'UPPERCASE TITLE',
        content: 'MiXeD Content',
        tags: ['TAG'],
      };

      const result = pipe.transform(dto);

      expect(result.title).toBe('UPPERCASE TITLE');
      expect(result.content).toBe('MiXeD Content');
      expect(result.tags).toEqual(['tag']);
    });
  });
});
