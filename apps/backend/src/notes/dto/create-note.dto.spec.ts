import { validate } from 'class-validator';
import { CreateNoteDto } from './create-note.dto';

describe('CreateNoteDto', () => {
  it('should validate with valid data', async () => {
    const dto = new CreateNoteDto();
    dto.title = 'Valid Title';
    dto.content = 'Valid content';
    dto.tags = ['valid-tag', 'tag123'];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept without tags', async () => {
    const dto = new CreateNoteDto();
    dto.title = 'Valid Title';
    dto.content = 'Valid content';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject missing title', async () => {
    const dto = new CreateNoteDto();
    dto.content = 'Valid content';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should reject missing content', async () => {
    const dto = new CreateNoteDto();
    dto.title = 'Valid Title';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('content');
  });

  describe('tags validation', () => {
    it('should reject invalid tag format', async () => {
      const dto = new CreateNoteDto();
      dto.title = 'Valid Title';
      dto.content = 'Valid content';
      dto.tags = ['Invalid Tag'];

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject uppercase tags', async () => {
      const dto = new CreateNoteDto();
      dto.title = 'Valid Title';
      dto.content = 'Valid content';
      dto.tags = ['UPPER'];

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject tags longer than 20 characters', async () => {
      const dto = new CreateNoteDto();
      dto.title = 'Valid Title';
      dto.content = 'Valid content';
      dto.tags = ['twentyonecharacterstag'];

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject more than 10 tags', async () => {
      const dto = new CreateNoteDto();
      dto.title = 'Valid Title';
      dto.content = 'Valid content';
      dto.tags = [
        'tag1',
        'tag2',
        'tag3',
        'tag4',
        'tag5',
        'tag6',
        'tag7',
        'tag8',
        'tag9',
        'tag10',
        'tag11',
      ];

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should accept exactly 10 tags', async () => {
      const dto = new CreateNoteDto();
      dto.title = 'Valid Title';
      dto.content = 'Valid content';
      dto.tags = [
        'tag1',
        'tag2',
        'tag3',
        'tag4',
        'tag5',
        'tag6',
        'tag7',
        'tag8',
        'tag9',
        'tag10',
      ];

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
