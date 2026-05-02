import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllNotesDto } from './dto/findAll.dto';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('NotesController (unit)', () => {
  let controller: NotesController;
  let service: NotesService;

  const mockNotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addComment: jest.fn(),
    getStats: jest.fn(),
    getActivity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a note with valid DTO', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test'],
      };
      const mockId = new ObjectId();
      const expected = { id: mockId, ...dto, comments: [], createdAt: new Date(), updatedAt: new Date() };
      mockNotesService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors gracefully', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: [],
      };
      mockNotesService.create.mockRejectedValue(new Error('DB Error'));

      await expect(controller.create(dto)).rejects.toThrow('DB Error');
    });
  });

  describe('findAll', () => {
    const mockResponse = {
      data: [
        { id: new ObjectId(), title: 'Note 1', content: 'Content 1', tags: [], commentCount: 0, views: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: new ObjectId(), title: 'Note 2', content: 'Content 2', tags: ['tag1'], commentCount: 2, views: 0, createdAt: new Date(), updatedAt: new Date() },
      ],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false },
      performance: { algorithmId: 'merge', algorithmName: 'Merge Sort', executionTimeMs: 1.5, dataSize: 2, timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', stable: true },
    };

    it('should return list of notes without comments', async () => {
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll({});

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, 1, 10);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no notes exist', async () => {
      const emptyResponse = { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }, performance: mockResponse.performance };
      mockNotesService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll({});

      expect(result.data).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, 1, 10);
    });

    it('should call service with tag parameter when provided', async () => {
      const tag = 'test';
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ tag });

      expect(service.findAll).toHaveBeenCalledWith(tag, undefined, undefined, undefined, 1, 10);
    });

    it('should call service with search parameter when provided', async () => {
      const search = 'test search';
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ search });

      expect(service.findAll).toHaveBeenCalledWith(undefined, search, undefined, undefined, 1, 10);
    });

    it('should call service with both tag and search parameters when provided', async () => {
      const tag = 'test';
      const search = 'test search';
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ tag, search });

      expect(service.findAll).toHaveBeenCalledWith(tag, search, undefined, undefined, 1, 10);
    });

    it('should call service with sort parameter when provided', async () => {
      const tag = 'test';
      const sort = 'alpha';
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ tag, sort });

      expect(service.findAll).toHaveBeenCalledWith(tag, undefined, 'alpha', undefined, 1, 10);
    });

    it('should call service with algorithm parameter when provided', async () => {
      const algorithm = 'quick';
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ algorithm });

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, 'quick', 1, 10);
    });

    it('should call service with pagination parameters when provided', async () => {
      mockNotesService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll({ page: 2, limit: 25 });

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, 2, 25);
    });
  });

  describe('findOne', () => {
    it('should return a single note by id', async () => {
      const mockId = new ObjectId();
      const mockNote = {
        id: mockId,
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test'],
        comments: [{ content: 'comment 1', createdAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNotesService.findOne.mockResolvedValue(mockNote);

      const result = await controller.findOne(mockId.toString());

      expect(result).toEqual(mockNote);
      expect(service.findOne).toHaveBeenCalledWith(mockId.toString());
    });

    it('should throw NotFoundException for invalid id', async () => {
      const invalidId = '123invalid';
      mockNotesService.findOne.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.findOne(invalidId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(invalidId);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      const validButNonExistentId = new ObjectId().toString();
      mockNotesService.findOne.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.findOne(validButNonExistentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update note with partial data', async () => {
      const mockId = new ObjectId();
      const updateDto: UpdateNoteDto = { title: 'Updated Title' };
      const updated = { id: mockId, title: 'Updated Title', content: 'original', tags: [], comments: [], createdAt: new Date(), updatedAt: new Date() };
      mockNotesService.update.mockResolvedValue(updated);

      const result = await controller.update(mockId.toString(), updateDto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(mockId.toString(), updateDto);
    });

    it('should update multiple fields', async () => {
      const mockId = new ObjectId();
      const updateDto: UpdateNoteDto = { title: 'New Title', content: 'New Content', tags: ['new'] };
      const updated = { id: mockId, ...updateDto, comments: [], createdAt: new Date(), updatedAt: new Date() };
      mockNotesService.update.mockResolvedValue(updated);

      const result = await controller.update(mockId.toString(), updateDto);

      expect(result.title).toBe('New Title');
      expect(result.content).toBe('New Content');
      expect(result.tags).toContain('new');
    });

    it('should throw NotFoundException for invalid id', async () => {
      const invalidId = '123invalid';
      mockNotesService.update.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.update(invalidId, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a note by id', async () => {
      const mockId = new ObjectId();
      const expected = { message: 'Note deleted successfully' };
      mockNotesService.delete.mockResolvedValue(expected);

      const result = await controller.delete(mockId.toString());

      expect(result).toEqual(expected);
      expect(service.delete).toHaveBeenCalledWith(mockId.toString());
    });

    it('should throw NotFoundException for invalid id', async () => {
      const invalidId = 'notanid';
      mockNotesService.delete.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.delete(invalidId)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(invalidId);
    });

    it('should handle delete errors', async () => {
      const mockId = new ObjectId();
      mockNotesService.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.delete(mockId.toString())).rejects.toThrow('Delete failed');
    });
  });

  describe('addComment', () => {
    it('should add a comment to a note successfully', async () => {
      const mockId = new ObjectId();
      const commentDto: CreateCommentDto = { content: 'Great note!' };
      const mockNoteWithComment = {
        id: mockId,
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test'],
        comments: [{ content: 'Great note!', createdAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNotesService.addComment.mockResolvedValue(mockNoteWithComment);

      const result = await controller.addComment(mockId.toString(), commentDto);

      expect(result).toEqual(mockNoteWithComment);
      expect(service.addComment).toHaveBeenCalledWith(mockId.toString(), commentDto);
    });

    it('should throw NotFoundException for invalid note id', async () => {
      const invalidId = '123invalid';
      const commentDto: CreateCommentDto = { content: 'Great note!' };
      mockNotesService.addComment.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.addComment(invalidId, commentDto)).rejects.toThrow(NotFoundException);
      expect(service.addComment).toHaveBeenCalledWith(invalidId, commentDto);
    });

    it('should throw NotFoundException for non-existent note id', async () => {
      const validButNonExistentId = new ObjectId().toString();
      const commentDto: CreateCommentDto = { content: 'Great note!' };
      mockNotesService.addComment.mockRejectedValue(new NotFoundException('Note not found'));

      await expect(controller.addComment(validButNonExistentId, commentDto)).rejects.toThrow(NotFoundException);
      expect(service.addComment).toHaveBeenCalledWith(validButNonExistentId, commentDto);
    });
  });
});

