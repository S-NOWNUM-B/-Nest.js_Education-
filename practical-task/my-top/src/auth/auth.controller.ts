import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  async registrt() {}

  @Post('login')
  async login() {}
}
