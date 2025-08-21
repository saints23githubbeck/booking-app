import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BookingModule } from '../booking.module'

describe('Bookings (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('detects booking conflict', async () => {
    const dto = {
      professional_id: 'pro1',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      start_time: '2025-08-21T10:30:00Z',
      duration_minutes: 30,
    };

    // First booking
    await request(app.getHttpServer())
      .post('/bookings')
      .set('Idempotency-Key', 'key1')
      .send(dto)
      .expect(201);

    // Conflicting booking
    await request(app.getHttpServer())
      .post('/bookings')
      .set('Idempotency-Key', 'key2')
      .send(dto)
      .expect(409); // Conflict
  });

  it('handles idempotency', async () => {
    const dto = {
      professional_id: 'pro1',
      start_time: '2025-08-21T11:00:00Z',
      duration_minutes: 30,
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
    };

    const res1 = await request(app.getHttpServer())
      .post('/bookings')
      .set('Idempotency-Key', 'key3')
      .send(dto)
      .expect(201);

    const res2 = await request(app.getHttpServer())
      .post('/bookings')
      .set('Idempotency-Key', 'key3')
      .send(dto)
      .expect(201);

    expect(res1.body).toEqual(res2.body); // Same response
  });
});