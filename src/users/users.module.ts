import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UsersService],
  imports: [PrismaModule],
  exports: [UsersService, PrismaService],
})
export class UsersModule {}
