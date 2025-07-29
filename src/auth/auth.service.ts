import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './auth.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser({ userName, password, id }: User) {
    // Logic to validate user credentials
    const findUser = await this.usersService.findOne(id);
    if (findUser && findUser.password === password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign({ user });
    }
    return 'unauthorized';
  }

  async register(userData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(userData.password, 10); // Salt rounds: 10
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...result } = newUser;
    return result;
  }
}
