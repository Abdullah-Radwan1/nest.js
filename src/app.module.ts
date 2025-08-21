import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [AuthModule, UsersModule, OrderModule],
  controllers: [AppController],
  providers: [UsersService, AppService],
})
export class AppModule {}
