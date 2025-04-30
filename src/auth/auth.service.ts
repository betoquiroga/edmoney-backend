import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../database/supabase.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { IAuthResponse, ITokenPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user with Supabase Auth and create a user profile
   */
  async register(createUserDto: CreateUserDto): Promise<IAuthResponse> {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email: createUserDto.email,
        password: createUserDto.password,
      });

    if (authError) {
      throw new BadRequestException(
        `Registration failed: ${authError.message}`,
      );
    }

    // Get user ID from the Supabase Auth response
    const userId = authData.user?.id;

    if (!userId) {
      throw new BadRequestException('User ID not found in auth response');
    }

    // Create user profile in the users table
    const user = await this.usersService.create(createUserDto, userId);

    // Generate JWT token
    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      user,
      token: this.jwtService.sign(payload),
      message: 'Registration successful',
    };
  }

  /**
   * Login a user with Supabase Auth
   */
  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

    if (authError || !authData.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user from database
    const user = await this.usersService.findById(authData.user.id);

    // Generate JWT token
    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      user,
      token: this.jwtService.sign(payload),
      message: 'Login successful',
    };
  }

  /**
   * Validate user token (for JWT strategy)
   */
  async validateUser(payload: ITokenPayload) {
    return this.usersService.findById(payload.sub);
  }
}
