import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../database/supabase.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { IAuthResponse, ITokenPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user with Supabase Auth and create a user profile
   */
  async register(createUserDto: CreateUserDto): Promise<IAuthResponse> {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email: createUserDto.email,
          password: createUserDto.password,
        });

      this.logger.debug(`Auth data: ${JSON.stringify(authData)}`);
      
      if (authError) {
        this.logger.error(`Registration error: ${authError.message}`);
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
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login a user with Supabase Auth
   */
  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    try {
      this.logger.debug(`Login attempt for email: ${loginDto.email}`);
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email: loginDto.email,
          password: loginDto.password,
        });

      if (authError) {
        this.logger.error(`Login error: ${authError.message}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!authData.user) {
        this.logger.error('No user returned from Supabase auth');
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.debug(`User authenticated with Supabase, ID: ${authData.user.id}`);

      // Get user from database
      try {
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
      } catch (error) {
        this.logger.error(`Error finding user: ${error.message}`);
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate user token (for JWT strategy)
   */
  async validateUser(payload: ITokenPayload) {
    return this.usersService.findById(payload.sub);
  }

  /**
   * Create a test user for development purposes
   */
  async createTestUser(): Promise<IAuthResponse> {
    const testUser = {
      id: '550e8400-e29b-41d4-a716-446655440000', // ID predefinido para pruebas
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    try {
      // Comprobar si el usuario ya existe en la tabla de usuarios
      const { data: existingUser, error: existingUserError } = await this.supabaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('email', testUser.email)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        this.logger.error(`Error checking existing user: ${existingUserError.message}`);
        throw new BadRequestException(`Error checking existing user: ${existingUserError.message}`);
      }

      let user = existingUser;

      // Si el usuario no existe, crearlo directamente en la tabla de usuarios
      if (!existingUser) {
        const { data: newUser, error: insertError } = await this.supabaseService
          .getClient()
          .from('users')
          .insert({
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .select()
          .single();

        if (insertError) {
          this.logger.error(`Error creating test user: ${insertError.message}`);
          throw new BadRequestException(`Error creating test user: ${insertError.message}`);
        }

        user = newUser;
        this.logger.debug('Test user created successfully');
      } else {
        this.logger.debug('Test user already exists');
      }

      // Generar token JWT
      const payload: ITokenPayload = {
        sub: user.id,
        email: user.email,
      };

      return {
        user,
        token: this.jwtService.sign(payload),
        message: 'Test user ready for use',
      };
    } catch (error) {
      this.logger.error(`Test user setup failed: ${error.message}`);
      throw error;
    }
  }
}
