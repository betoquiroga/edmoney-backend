import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category, TransactionType } from './entities/category.entity';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll({
    userId,
    type,
    isDefault,
  }: {
    userId?: string;
    type?: TransactionType;
    isDefault?: boolean;
  }) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('categories').select('*');
      
      // Aplicar filtros si existen
      if (userId) {
        // Buscar categorías del usuario o las categorías por defecto (user_id es null)
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
        console.error('Error al buscar categorías:', error);
        return []; // Devolver array vacío en caso de error
      }
      
      return data as Category[];
    } catch (error) {
      console.error('Error inesperado al buscar categorías:', error);
      return []; // Devolver array vacío en caso de error
    }
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return data as Category;
  }

  async findByUser(userId: string, type?: TransactionType) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('categories').select('*');
      
      // Buscar categorías del usuario o las categorías por defecto (user_id es null)
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error al buscar categorías del usuario:', error);
        return []; // Devolver array vacío en caso de error
      }
      
      return data as Category[];
    } catch (error) {
      console.error('Error inesperado al buscar categorías del usuario:', error);
      return []; // Devolver array vacío en caso de error
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const supabase = this.supabaseService.getClient();
    
    const newCategory = {
      ...createCategoryDto,
      is_default: createCategoryDto.is_default ?? false,
      is_active: createCategoryDto.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert(newCategory)
      .select()
      .single();
      
    if (error) {
      console.error('Error al crear categoría:', error);
      throw new Error(`Error creating category: ${error.message}`);
    }
    
    return data as Category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Primero verificar si la categoría existe
    await this.findOne(id);
    
    const supabase = this.supabaseService.getClient();
    
    const updateData = {
      ...updateCategoryDto,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error(`Error updating category: ${error.message}`);
    }
    
    return data as Category;
  }

  async remove(id: string) {
    // Primero verificar si la categoría existe
    await this.findOne(id);
    
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error al eliminar categoría:', error);
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }
}
