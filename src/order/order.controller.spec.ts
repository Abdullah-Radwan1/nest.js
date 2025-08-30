import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              status: OrderStatus.PENDING,
              totalAmount: 100,
              items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                status: OrderStatus.PENDING,
                totalAmount: 100,
                items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
              },
            ]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              status: OrderStatus.PENDING,
              totalAmount: 100,
              items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
            }),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should create an order', async () => {
    const dto: CreateOrderDto = {
      status: OrderStatus.PENDING,
      totalAmount: 100,
      items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    };
    const result = await controller.create(dto);
    expect(result).toEqual({
      id: 1,
      status: OrderStatus.PENDING,
      totalAmount: 100,
      items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
