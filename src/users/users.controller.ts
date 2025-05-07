import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  DeleteUserDocs,
  FindAllUsersDocs,
  FindOneUserDocs,
  UpdateUserDocs,
} from '../swagger/users.swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IUserResponse, IUsersResponse } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  @FindAllUsersDocs()
  async findAll(): Promise<IUsersResponse> {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req): Promise<IUserResponse> {
    return { user: req.user };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @FindOneUserDocs()
  async findOne(@Param('id') id: string): Promise<IUserResponse> {
    const user = await this.usersService.findById(id);
    return { user };
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UpdateUserDocs()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.usersService.update(id, updateUserDto);
    return { user, message: 'User updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @DeleteUserDocs()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
