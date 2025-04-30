import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { IAuthResponse } from './interfaces/auth.interface';
import { LoginDocs, RegisterDocs } from '../swagger/auth.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterDocs()
  async register(@Body() createUserDto: CreateUserDto): Promise<IAuthResponse> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @LoginDocs()
  async login(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.login(loginDto);
  }
}
