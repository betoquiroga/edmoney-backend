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
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { JwtGuard } from '../auth/jwt.guard';
import {
  CreateCategoryDocs,
  DeleteCategoryDocs,
  FindAllCategoriesDocs,
  FindOneCategoryDocs,
  FindUserCategoriesDocs,
  UpdateCategoryDocs,
} from '../swagger/categories.swagger';
import { TransactionType } from './entities/category.entity';
import { RequiredParamPipe } from '../helpers/pipes/required-param.pipe';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @FindAllCategoriesDocs()
  @Get()
  async findAll(
    @Query('user_id') userId?: string,
    @Query('type') type?: TransactionType,
    @Query('is_default') isDefault?: boolean,
  ) {
    const categories = await this.categoriesService.findAll({
      userId,
      type,
      isDefault,
    });
    return { categories };
  }

  @FindOneCategoryDocs()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    return { category };
  }

  @FindUserCategoriesDocs()
  @Get('user/:userId')
  async findByUser(
    @Param('userId', new RequiredParamPipe()) userId: string,
    @Query('type') type?: TransactionType,
  ) {
    const categories = await this.categoriesService.findByUser(userId, type);
    return { categories };
  }

  @CreateCategoryDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      category,
      message: 'Category created successfully',
    };
  }

  @UpdateCategoryDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return {
      category,
      message: 'Category updated successfully',
    };
  }

  @DeleteCategoryDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
