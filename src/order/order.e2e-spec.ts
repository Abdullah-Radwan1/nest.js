// Import NestJS core types
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Import the NestJS testing utilities
import { Test, TestingModule } from '@nestjs/testing';
// Import supertest to simulate HTTP requests
import * as request from 'supertest';
// Import the controller & service we are testing
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
// Import the enum from Prisma for status values
import { OrderStatus } from '@prisma/client';
describe('OrderController (e2e)', () => {
  let app: INestApplication; // This will hold our running NestJS app

  // Mock implementation of the OrderService
  // Instead of calling the real DB, we return fake data
  const mockOrderService = {
    create: jest.fn().mockImplementation((dto) => ({
      id: 1, // Pretend the DB assigned id=1
      ...dto, // Spread back the DTO into the response
    })),
  };

  // Runs once before all tests in this describe block
  beforeAll(async () => {
    // Create a NestJS testing module with our controller and mocked service
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          // When something asks for OrderService...
          useValue: mockOrderService, // ...give it the mock instead of the real service
        },
      ],
    }).compile();

    // Create a full NestJS application instance from the module
    app = moduleFixture.createNestApplication();

    // Enable global validation pipe (like in main.ts of a real app)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties not in the DTO
        forbidNonWhitelisted: true, // Throw error if extra props passed
        transform: true, // Convert types (e.g., "5" → 5)
      }),
    );

    // Initialize the app (like calling await app.listen() in main.ts)
    await app.init();
  });

  // Runs once after all tests in this describe block
  afterAll(async () => {
    await app.close(); // Shut down the Nest app
  });

  // ✅ Happy path test
  it('✅ should create an order with valid data', async () => {
    // Valid payload that matches CreateOrderDto
    const validOrder = {
      status: OrderStatus.PENDING,
      totalAmount: 100,
      items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    };

    // Send POST request to /order with validOrder payload
    return request(app.getHttpServer())
      .post('/order')
      .send(validOrder)
      .expect(201) // Expect HTTP status 201 Created
      .expect((res) => {
        // Response should contain id, status, totalAmount
        expect(res.body).toMatchObject({
          id: 1,
          status: OrderStatus.PENDING,
          totalAmount: 100,
        });
      });
  });

  // ❌ Invalid totalAmount
  it('❌ should fail when totalAmount is negative', async () => {
    const invalidOrder = {
      status: OrderStatus.PENDING,
      totalAmount: -50, // Invalid: must be positive
      items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    };

    return request(app.getHttpServer())
      .post('/order')
      .send(invalidOrder)
      .expect(400) // Expect HTTP 400 Bad Request
      .expect((res) => {
        // Error message should mention positive number requirement
        expect(res.body.message).toContain(
          'totalAmount must be a positive number',
        );
      });
  });

  // ❌ Invalid status
  it('❌ should fail when status is invalid', async () => {
    const invalidOrder = {
      status: 'INVALID_STATUS', // Not part of OrderStatus enum
      totalAmount: 100,
      items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    };

    return request(app.getHttpServer())
      .post('/order')
      .send(invalidOrder)
      .expect(400) // Expect HTTP 400 Bad Request
      .expect((res) => {
        // Error message should mention allowed enum values
        expect(res.body.message[0]).toContain('status must be one of:');
      });
  });
});
