import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInputMethodDto } from './dtos/create-input-method.dto';
import { UpdateInputMethodDto } from './dtos/update-input-method.dto';
import { InputMethod } from './entities/input-method.entity';

@Injectable()
export class InputMethodsService {
  // This is a placeholder service implementation
  // In a real implementation, you would inject a database repository

  private inputMethods: InputMethod[] = [
    // Sample input methods for development
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'manual',
      description: 'Manual transaction entry through the user interface',
      is_active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'voice',
      description: 'Voice recognition for transaction input',
      is_active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'image',
      description: 'Receipt scanning for transaction data extraction',
      is_active: false,
    },
  ];

  async findAll(isActive?: boolean) {
    if (isActive !== undefined) {
      return this.inputMethods.filter(
        (method) => method.is_active === isActive,
      );
    }
    return this.inputMethods;
  }

  async findOne(id: string) {
    const inputMethod = this.inputMethods.find((method) => method.id === id);
    if (!inputMethod) {
      throw new NotFoundException(`Input method with ID ${id} not found`);
    }
    return inputMethod;
  }

  async create(createInputMethodDto: CreateInputMethodDto) {
    const newInputMethod: InputMethod = {
      id: this.generateId(),
      name: createInputMethodDto.name,
      description: createInputMethodDto.description,
      is_active: createInputMethodDto.is_active ?? true,
    };

    this.inputMethods.push(newInputMethod);
    return newInputMethod;
  }

  async update(id: string, updateInputMethodDto: UpdateInputMethodDto) {
    const index = this.inputMethods.findIndex((method) => method.id === id);
    if (index === -1) {
      throw new NotFoundException(`Input method with ID ${id} not found`);
    }

    const updatedInputMethod = {
      ...this.inputMethods[index],
      ...updateInputMethodDto,
    };

    this.inputMethods[index] = updatedInputMethod;
    return updatedInputMethod;
  }

  async remove(id: string) {
    const index = this.inputMethods.findIndex((method) => method.id === id);
    if (index === -1) {
      throw new NotFoundException(`Input method with ID ${id} not found`);
    }

    this.inputMethods.splice(index, 1);
  }

  private generateId(): string {
    // Simple mock UUID generator
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }
}
