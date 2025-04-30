import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { SubscriptionStatus } from './entities/subscription.entity';
import { ISubscription } from './interfaces/subscription.interface';

@Injectable()
export class SubscriptionsService {
  private readonly TABLE_NAME = 'subscriptions';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Find all subscriptions with optional user filter
   */
  async findAll(userId?: string): Promise<ISubscription[]> {
    let query = this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch subscriptions');
    }

    return data as ISubscription[];
  }

  /**
   * Find a subscription by ID
   */
  async findById(id: string): Promise<ISubscription> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return data as ISubscription;
  }

  /**
   * Find subscriptions for a specific user
   */
  async findByUserId(userId: string): Promise<ISubscription[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscriptions for user ${userId}`);
    }

    return data as ISubscription[];
  }

  /**
   * Create a new subscription
   */
  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<ISubscription> {
    const now = new Date();

    const subscriptionData = {
      user_id: createSubscriptionDto.user_id,
      plan_id: createSubscriptionDto.plan_id,
      status: createSubscriptionDto.status || SubscriptionStatus.ACTIVE,
      start_date: createSubscriptionDto.start_date || now,
      end_date: createSubscriptionDto.end_date,
      current_period_start: createSubscriptionDto.current_period_start || now,
      current_period_end: createSubscriptionDto.current_period_end,
      paypal_subscription_id: createSubscriptionDto.paypal_subscription_id,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data as ISubscription;
  }

  /**
   * Update a subscription by ID
   */
  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ISubscription> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update({
        ...(updateSubscriptionDto.plan_id && {
          plan_id: updateSubscriptionDto.plan_id,
        }),
        ...(updateSubscriptionDto.status && {
          status: updateSubscriptionDto.status,
        }),
        ...(updateSubscriptionDto.end_date && {
          end_date: updateSubscriptionDto.end_date,
        }),
        ...(updateSubscriptionDto.current_period_start && {
          current_period_start: updateSubscriptionDto.current_period_start,
        }),
        ...(updateSubscriptionDto.current_period_end && {
          current_period_end: updateSubscriptionDto.current_period_end,
        }),
        ...(updateSubscriptionDto.paypal_subscription_id && {
          paypal_subscription_id: updateSubscriptionDto.paypal_subscription_id,
        }),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return data as ISubscription;
  }

  /**
   * Cancel a subscription (change status to CANCELED)
   */
  async cancel(id: string): Promise<ISubscription> {
    // First verify the subscription exists
    await this.findById(id);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .update({
        status: SubscriptionStatus.CANCELED,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return data as ISubscription;
  }

  /**
   * Delete a subscription by ID
   */
  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }
  }

  /**
   * Check if a user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.TABLE_NAME)
      .select('id')
      .eq('user_id', userId)
      .eq('status', SubscriptionStatus.ACTIVE)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check subscription status: ${error.message}`);
    }

    return !!data;
  }
}
