import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
const request = require('supertest');

describe('Usuarios', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /status', () => {
    return request(app.getHttpServer())
      .get('/status')
      .expect(200, { status: 'OK' });
  });

  afterAll(async () => {
    await app.close();
  });
});
