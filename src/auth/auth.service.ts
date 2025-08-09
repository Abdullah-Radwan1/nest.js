import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDTO) {
    const existingUser = await this.usersService.findOne(userData.userName);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async login(userData: LoginDTO) {
    const findUser = await this.usersService.findOne(userData.email);
    if (!findUser) {
      throw new UnauthorizedException('user not found');
    }

    const isMatch = await bcrypt.compare(userData.password, findUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...user } = findUser;
    return this.jwtService.sign({ user });
  }
}
