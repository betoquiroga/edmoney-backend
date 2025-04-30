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
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  CancelSubscriptionDocs,
  CreateSubscriptionDocs,
  DeleteSubscriptionDocs,
  FindAllSubscriptionsDocs,
  FindOneSubscriptionDocs,
  FindUserSubscriptionsDocs,
  UpdateSubscriptionDocs,
} from '../swagger/subscriptions.swagger';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import {
  ISubscriptionResponse,
  ISubscriptionsResponse,
} from './interfaces/subscription.interface';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @FindAllSubscriptionsDocs()
  async findAll(
    @Query('user_id') userId?: string,
  ): Promise<ISubscriptionsResponse> {
    const subscriptions = await this.subscriptionsService.findAll(userId);
    return { subscriptions };
  }

  @Get(':id')
  @FindOneSubscriptionDocs()
  async findOne(@Param('id') id: string): Promise<ISubscriptionResponse> {
    const subscription = await this.subscriptionsService.findById(id);
    return { subscription };
  }

  @Get('user/:userId')
  @FindUserSubscriptionsDocs()
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ISubscriptionsResponse> {
    const subscriptions = await this.subscriptionsService.findByUserId(userId);
    return { subscriptions };
  }

  @Post()
  @CreateSubscriptionDocs()
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<ISubscriptionResponse> {
    const subscription = await this.subscriptionsService.create(
      createSubscriptionDto,
    );
    return { subscription, message: 'Subscription created successfully' };
  }

  @Patch(':id')
  @UpdateSubscriptionDocs()
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ISubscriptionResponse> {
    const subscription = await this.subscriptionsService.update(
      id,
      updateSubscriptionDto,
    );
    return { subscription, message: 'Subscription updated successfully' };
  }

  @Patch(':id/cancel')
  @CancelSubscriptionDocs()
  async cancel(@Param('id') id: string): Promise<ISubscriptionResponse> {
    const subscription = await this.subscriptionsService.cancel(id);
    return { subscription, message: 'Subscription canceled successfully' };
  }

  @Delete(':id')
  @DeleteSubscriptionDocs()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.subscriptionsService.remove(id);
    return { message: 'Subscription deleted successfully' };
  }
}
