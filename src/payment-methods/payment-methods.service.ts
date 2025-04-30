import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import {
  PaymentMethod,
  PaymentMethodType,
} from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  // This is a placeholder service implementation
  // In a real implementation, you would inject a database repository

  private paymentMethods: PaymentMethod[] = [
    // Sample payment methods for development
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: null,
      name: 'Cash',
      type: PaymentMethodType.CASH,
      icon: 'money-bill',
      is_default: true,
      is_active: true,
      created_at: new Date('2023-06-01T12:00:00Z'),
      updated_at: new Date('2023-06-01T12:00:00Z'),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      user_id: '550e8400-e29b-41d4-a716-446655441111',
      name: 'My Visa Credit Card',
      type: PaymentMethodType.CREDIT_CARD,
      icon: 'credit-card',
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
    type?: PaymentMethodType;
    isDefault?: boolean;
  }) {
    let filteredMethods = [...this.paymentMethods];

    if (userId) {
      filteredMethods = filteredMethods.filter(
        (method) => method.user_id === userId || method.user_id === null,
      );
    }

    if (type) {
      filteredMethods = filteredMethods.filter(
        (method) => method.type === type,
      );
    }

    if (isDefault !== undefined) {
      filteredMethods = filteredMethods.filter(
        (method) => method.is_default === isDefault,
      );
    }

    return filteredMethods;
  }

  async findOne(id: string) {
    const paymentMethod = this.paymentMethods.find(
      (method) => method.id === id,
    );
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return paymentMethod;
  }

  async findByUser(userId: string, type?: PaymentMethodType) {
    // Get both user-specific payment methods and default payment methods
    let methods = this.paymentMethods.filter(
      (method) => method.user_id === userId || method.user_id === null,
    );

    if (type) {
      methods = methods.filter((method) => method.type === type);
    }

    return methods;
  }

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const newPaymentMethod: PaymentMethod = {
      id: this.generateId(),
      ...createPaymentMethodDto,
      is_default: createPaymentMethodDto.is_default ?? false,
      is_active: createPaymentMethodDto.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.paymentMethods.push(newPaymentMethod);
    return newPaymentMethod;
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const index = this.paymentMethods.findIndex((method) => method.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    // Don't allow modifying default payment methods for non-admins
    if (this.paymentMethods[index].is_default === true) {
      // In a real implementation, you would check if the user is an admin
      // For now, we'll allow the update in this mock service
    }

    const updatedPaymentMethod = {
      ...this.paymentMethods[index],
      ...updatePaymentMethodDto,
      updated_at: new Date(),
    };

    this.paymentMethods[index] = updatedPaymentMethod;
    return updatedPaymentMethod;
  }

  async remove(id: string) {
    const index = this.paymentMethods.findIndex((method) => method.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    // Don't allow deleting default payment methods for non-admins
    if (this.paymentMethods[index].is_default === true) {
      // In a real implementation, you would check if the user is an admin
      // For now, we'll allow the deletion in this mock service
    }

    this.paymentMethods.splice(index, 1);
  }

  private generateId(): string {
    // Simple mock UUID generator
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  }
}
