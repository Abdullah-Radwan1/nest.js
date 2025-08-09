import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import { RegisterDTO } from 'src/auth/auth.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(createUserDto: RegisterDTO) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
