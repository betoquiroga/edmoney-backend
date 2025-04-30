import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { IPlan } from './interfaces/plan.interface';

@Injectable()
export class PlansService {
  private readonly TABLE_NAME = 'plans';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Find all plans
   */
  async findAll(): Promise<IPlan[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch plans');
    }

    return data as IPlan[];
  }

  /**
   * Find a plan by ID
   */
  async findById(id: string): Promise<IPlan> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return data as IPlan;
  }

  /**
   * Create a new plan
   */
  async create(createPlanDto: CreatePlanDto): Promise<IPlan> {
    const planData = {
      name: createPlanDto.name,
      description: createPlanDto.description,
      price: createPlanDto.price,
      features: createPlanDto.features || {},
      maxUsage: createPlanDto.maxUsage || 0,
      isActive:
        createPlanDto.isActive !== undefined ? createPlanDto.isActive : true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }

    return data as IPlan;
  }

  /**
   * Update a plan by ID
   */
  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<IPlan> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update({
        ...(updatePlanDto.name && { name: updatePlanDto.name }),
        ...(updatePlanDto.description && {
          description: updatePlanDto.description,
        }),
        ...(updatePlanDto.price !== undefined && {
          price: updatePlanDto.price,
        }),
        ...(updatePlanDto.features && { features: updatePlanDto.features }),
        ...(updatePlanDto.maxUsage !== undefined && {
          maxUsage: updatePlanDto.maxUsage,
        }),
        ...(updatePlanDto.isActive !== undefined && {
          isActive: updatePlanDto.isActive,
        }),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update plan: ${error.message}`);
    }

    return data as IPlan;
  }

  /**
   * Delete a plan by ID
   */
  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete plan: ${error.message}`);
    }
  }
}
