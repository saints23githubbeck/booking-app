import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { SearchModule } from '../search.module';

describe('Search Professionals (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 🔹 Do NOT seed here anymore
    // Seed data should already exist from a global seeder or test setup script
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return professionals within radius with correct filters', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 37.7749,
        long: -122.4194,
        location_radius_km: 10,
        category: 'tutor',
        rate_per_minute: 150,
        travel_category: 'driving',
      })
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      id: 'pro1',
      name: 'John Doe',
      category: 'tutor',
      rate_per_minute: 100,
      location_lat: 37.7749,
      location_long: -122.4194,
      distance_km: expect.any(Number),
    });
    expect(response.body[0].distance_km).toBeLessThanOrEqual(10);
  });

  it('should return empty array if no professionals match filters', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 37.7749,
        long: -122.4194,
        location_radius_km: 1,
        category: 'tutor',
        rate_per_minute: 50,
        travel_category: 'driving',
      })
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return professionals without location filter if not provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        category: 'tutor',
        rate_per_minute: 150,
        travel_category: 'walking',
      })
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      id: 'pro1',
      name: 'John Doe',
      category: 'tutor',
      rate_per_minute: 100,
    });
    expect(response.body[0].distance_km).toBeDefined();
  });

  it('should handle missing optional parameters', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 37.7749,
        long: -122.4194,
      })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('distance_km');
  });

  it('should return 400 for invalid query parameters', async () => {
    await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 'invalid', // Non-numeric
        long: -122.4194,
        location_radius_km: 10,
        category: 'tutor',
      })
      .expect(400);
  });

  it('should adjust distance based on travel mode', async () => {
    const drivingResponse = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 37.7849,
        long: -122.4294,
        location_radius_km: 10,
        category: 'consultant',
        travel_category: 'driving',
      })
      .expect(200);

    const walkingResponse = await request(app.getHttpServer())
      .get('/search/professionals')
      .query({
        lat: 37.7849,
        long: -122.4294,
        location_radius_km: 10,
        category: 'consultant',
        travel_category: 'walking',
      })
      .expect(200);

    expect(drivingResponse.body[0].distance_km).toBeLessThan(
      walkingResponse.body[0].distance_km,
    );
  });
});
