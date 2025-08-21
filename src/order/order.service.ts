import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    this.prisma.order.create({
      data: {
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        totalAmount: createOrderDto.totalAmount,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  findUserOrders(userId: string, take: number, skip: number) {
    return this.prisma.order.findMany({
      where: { userId },
      take,
      skip,
      orderBy: {
        createdAt: 'desc', // You can order by fields like `createdAt` if required
      },
    });
  }

  async getUserOrdersWithCount(userId: string, take: number, skip: number) {
    const [orders, totalCount] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { userId },
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { orders, totalCount };
  }
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
