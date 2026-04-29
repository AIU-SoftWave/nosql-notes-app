import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let createdNoteId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect({ success: true, data: 'Notes API is running' });
  });

  it('/api/notes (POST, GET, PATCH, DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/notes')
      .send({
        title: 'Test note',
        content: 'Test content',
        tags: ['test'],
      })
      .expect(201);

    createdNoteId = createResponse.body.data._id;
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.title).toBe('Test note');

    await request(app.getHttpServer())
      .get('/api/notes')
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

    const viewResponse = await request(app.getHttpServer())
      .patch(`/api/notes/${createdNoteId}/view`)
      .expect(200);
    expect(viewResponse.body.data.views).toBe(1);

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/notes/${createdNoteId}`)
      .expect(200);
    expect(deleteResponse.body.data.deleted).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
