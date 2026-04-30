import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { Note } from '../src/entities/note.entity';
import { NotesController } from '../src/notes/notes.controller';
import { NotesService } from '../src/notes/notes.service';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  const notes: Note[] = [];

  const repositoryMock = {
    create: jest.fn((input: Partial<Note>) => ({
      id: new ObjectId(),
      title: input.title ?? '',
      content: input.content ?? '',
      tags: input.tags ?? [],
      comments: input.comments ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    save: jest.fn(async (note: Note) => {
      const existingIndex = notes.findIndex((item) => item.id.equals(note.id));
      const storedNote = {
        ...note,
        createdAt: note.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      if (existingIndex === -1) {
        notes.push(storedNote);
      } else {
        notes[existingIndex] = storedNote;
      }

      return storedNote;
    }),
    find: jest.fn(async () =>
      [...notes].sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      ),
    ),
    findOne: jest.fn(async ({ where }: { where: { id: ObjectId } }) =>
      notes.find((item) => item.id.equals(where.id)) ?? null,
    ),
    delete: jest.fn(async (id: ObjectId) => {
      const index = notes.findIndex((item) => item.id.equals(id));
      if (index !== -1) {
        notes.splice(index, 1);
      }
      return { affected: index === -1 ? 0 : 1 };
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, NotesController],
      providers: [
        AppService,
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: repositoryMock,
        },
      ],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    notes.splice(0, notes.length);
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect({ success: true, data: 'Notes API is running' });
  });

  it('supports full Notes CRUD flow', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/notes')
      .send({
        title: 'Test note',
        content: 'Test content',
        tags: ['test'],
      })
      .expect(201);

    const noteId = createResponse.body.data.id;

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          title: 'Test note',
          content: 'Test content',
          tags: ['test'],
          comments: [],
        }),
      }),
    );

    const listResponse = await request(app.getHttpServer())
      .get('/api/notes')
      .expect(200);

    expect(listResponse.body).toEqual(
      expect.objectContaining({
        success: true,
        data: [
          expect.objectContaining({
            title: 'Test note',
            commentCount: 0,
          }),
        ],
      }),
    );
    expect(listResponse.body.data[0]).not.toHaveProperty('comments');

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .expect(200);

    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          title: 'Test note',
          comments: [],
        }),
      }),
    );

    const updateResponse = await request(app.getHttpServer())
      .put(`/api/notes/${noteId}`)
      .send({
        title: 'Updated note',
      })
      .expect(200);

    expect(updateResponse.body.data.title).toBe('Updated note');

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .expect(200);

    expect(deleteResponse.body).toEqual({
      success: true,
      data: {
        message: 'Note deleted successfully',
      },
    });
  });

  it('returns 404 for unknown note ids', async () => {
    await request(app.getHttpServer())
      .get(`/api/notes/${new ObjectId().toHexString()}`)
      .expect(404)
      .expect((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Note not found');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
