import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import {
  PaymentMethod,
  PaymentMethodType,
} from './entities/payment-method.entity';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll({
    userId,
    type,
    isDefault,
  }: {
    userId?: string;
    type?: PaymentMethodType;
    isDefault?: boolean;
  }) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('payment_methods').select('*');
      
      // Aplicar filtros si existen
      if (userId) {
        // Buscar métodos de pago del usuario o los métodos por defecto (user_id es null)
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      
      if (type) {
        query = query.eq('type', type);
      }
      
      if (isDefault !== undefined) {
        query = query.eq('is_default', isDefault);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error al buscar métodos de pago:', error);
        return []; // Devolver array vacío en caso de error
      }
      
      return data as PaymentMethod[];
    } catch (error) {
      console.error('Error inesperado al buscar métodos de pago:', error);
      return []; // Devolver array vacío en caso de error
    }
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    
    return data as PaymentMethod;
  }

  async findByUser(userId: string, type?: PaymentMethodType) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('payment_methods').select('*');
      
      // Buscar métodos de pago del usuario o los métodos por defecto (user_id es null)
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error al buscar métodos de pago del usuario:', error);
        return []; // Devolver array vacío en caso de error
      }
      
      return data as PaymentMethod[];
    } catch (error) {
      console.error('Error inesperado al buscar métodos de pago del usuario:', error);
      return []; // Devolver array vacío en caso de error
    }
  }

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const supabase = this.supabaseService.getClient();
    
    const newPaymentMethod = {
      ...createPaymentMethodDto,
      is_default: createPaymentMethodDto.is_default ?? false,
      is_active: createPaymentMethodDto.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(newPaymentMethod)
      .select()
      .single();
      
    if (error) {
      console.error('Error al crear método de pago:', error);
      throw new Error(`Error creating payment method: ${error.message}`);
    }
    
    return data as PaymentMethod;
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    // Primero verificar si el método de pago existe
    await this.findOne(id);
    
    const supabase = this.supabaseService.getClient();
    
    const updateData = {
      ...updatePaymentMethodDto,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('payment_methods')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error al actualizar método de pago:', error);
      throw new Error(`Error updating payment method: ${error.message}`);
    }
    
    return data as PaymentMethod;
  }

  async remove(id: string) {
    // Primero verificar si el método de pago existe
    await this.findOne(id);
    
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error al eliminar método de pago:', error);
      throw new Error(`Error deleting payment method: ${error.message}`);
    }
  }
}
