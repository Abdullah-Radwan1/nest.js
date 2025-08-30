import {
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class OrderItemDto {
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsEnum(OrderStatus, {
    message: `status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  status!: OrderStatus;

  @IsNumber()
  @IsPositive()
  totalAmount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  //Tells NestJS to validate each object inside the array using its own class decorators.
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
  // Converts raw JSON objects into actual OrderItemDto instances before validation runs.
  //Also handles type conversion — for example, "5" (string) can be transformed to 5 (number) if needed
}
