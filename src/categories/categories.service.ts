import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category, TransactionType } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  // This is a placeholder service implementation
  // In a real implementation, you would inject a database repository

  private categories: Category[] = [
    // Sample categories for development
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: null,
      name: 'Groceries',
      type: TransactionType.EXPENSE,
      icon: 'shopping-cart',
      is_default: true,
      is_active: true,
      created_at: new Date('2023-06-01T12:00:00Z'),
      updated_at: new Date('2023-06-01T12:00:00Z'),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      user_id: '550e8400-e29b-41d4-a716-446655441111',
      name: 'My Salary',
      type: TransactionType.INCOME,
      icon: 'wallet',
      is_default: false,
      is_active: true,
      created_at: new Date('2023-06-01T12:00:00Z'),
      updated_at: new Date('2023-06-01T12:00:00Z'),
    },
  ];

  async findAll({
    userId,
    type,
    isDefault,
  }: {
    userId?: string;
    type?: TransactionType;
    isDefault?: boolean;
  }) {
    let filteredCategories = [...this.categories];

    if (userId) {
      filteredCategories = filteredCategories.filter(
        (cat) => cat.user_id === userId || cat.user_id === null,
      );
    }

    if (type) {
      filteredCategories = filteredCategories.filter(
        (cat) => cat.type === type,
      );
    }

    if (isDefault !== undefined) {
      filteredCategories = filteredCategories.filter(
        (cat) => cat.is_default === isDefault,
      );
    }

    return filteredCategories;
  }

  async findOne(id: string) {
    const category = this.categories.find((cat) => cat.id === id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByUser(userId: string, type?: TransactionType) {
    // Get both user-specific categories and default categories
    let categories = this.categories.filter(
      (cat) => cat.user_id === userId || cat.user_id === null,
    );

    if (type) {
      categories = categories.filter((cat) => cat.type === type);
    }

    return categories;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory: Category = {
      id: this.generateId(),
      ...createCategoryDto,
      is_default: createCategoryDto.is_default ?? false,
      is_active: createCategoryDto.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const index = this.categories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Don't allow modifying default categories for non-admins
    if (this.categories[index].is_default === true) {
      // In a real implementation, you would check if the user is an admin
      // For now, we'll allow the update in this mock service
    }

    const updatedCategory = {
      ...this.categories[index],
      ...updateCategoryDto,
      updated_at: new Date(),
    };

    this.categories[index] = updatedCategory;
    return updatedCategory;
  }

  async remove(id: string) {
    const index = this.categories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Don't allow deleting default categories for non-admins
    if (this.categories[index].is_default === true) {
      // In a real implementation, you would check if the user is an admin
      // For now, we'll allow the deletion in this mock service
    }

    this.categories.splice(index, 1);
  }

  private generateId(): string {
    // Simple mock UUID generator
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }
}
