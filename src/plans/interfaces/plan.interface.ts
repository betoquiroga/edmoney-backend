import { Plan } from '../entities/plan.entity';

export interface IPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: Record<string, any>;
  maxUsage: number;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IPlanResponse {
  plan: Plan;
  message?: string;
}

export interface IPlansResponse {
  plans: Plan[];
}
