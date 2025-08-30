import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register({
      userName: body.userName,
      email: body.email,
      password: body.password,
    });
  }
}
