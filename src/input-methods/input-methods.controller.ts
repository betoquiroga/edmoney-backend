import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InputMethodsService } from './input-methods.service';
import { CreateInputMethodDto } from './dtos/create-input-method.dto';
import { UpdateInputMethodDto } from './dtos/update-input-method.dto';
import { JwtGuard } from '../auth/jwt.guard';
import {
  CreateInputMethodDocs,
  DeleteInputMethodDocs,
  FindAllInputMethodsDocs,
  FindOneInputMethodDocs,
  UpdateInputMethodDocs,
} from '../swagger/input-methods.swagger';

@ApiTags('input-methods')
@Controller('input-methods')
export class InputMethodsController {
  constructor(private readonly inputMethodsService: InputMethodsService) {}

  @FindAllInputMethodsDocs()
  @Get()
  async findAll(@Query('is_active') isActive?: boolean) {
    const inputMethods = await this.inputMethodsService.findAll(isActive);
    return { inputMethods };
  }

  @FindOneInputMethodDocs()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const inputMethod = await this.inputMethodsService.findOne(id);
    return { inputMethod };
  }

  @CreateInputMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createInputMethodDto: CreateInputMethodDto) {
    const inputMethod =
      await this.inputMethodsService.create(createInputMethodDto);
    return {
      inputMethod,
      message: 'Input method created successfully',
    };
  }

  @UpdateInputMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInputMethodDto: UpdateInputMethodDto,
  ) {
    const inputMethod = await this.inputMethodsService.update(
      id,
      updateInputMethodDto,
    );
    return {
      inputMethod,
      message: 'Input method updated successfully',
    };
  }

  @DeleteInputMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.inputMethodsService.remove(id);
    return { message: 'Input method deleted successfully' };
  }
}
