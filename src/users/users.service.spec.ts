import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order/order.service';
import { PrismaService } from '../prisma/prisma.service'; // adjust path

describe('OrderService', () => {
  let service: OrderService;

  // Create a fake PrismaService
  const mockPrisma = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
