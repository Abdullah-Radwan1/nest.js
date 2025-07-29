import { Body, Controller, Post } from '@nestjs/common';
// import {authpay} from "./"

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { userName: string; password: string }) {}
}
