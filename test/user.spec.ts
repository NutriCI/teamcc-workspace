import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });
  
  describe("POST /api/users", () => {
    beforeEach(async () => {
      await testService.deleteUser();
    })
    it('request ditolak jika data invalid', async () => {
      const response = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: '',
        email: '',
        name: '',
        password: '',
      });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('bisa melakukan registrasi', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          email: 'test@test.com',
          name: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('reject jika username sudah ada', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          email: 'test@test.com',
          name: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined()
    });

  });

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })
    it('request ditolak jika data invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('bisa melakukan login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });
});
