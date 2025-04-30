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
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import { JwtGuard } from '../auth/jwt.guard';
import {
  CreatePaymentMethodDocs,
  DeletePaymentMethodDocs,
  FindAllPaymentMethodsDocs,
  FindOnePaymentMethodDocs,
  FindUserPaymentMethodsDocs,
  UpdatePaymentMethodDocs,
} from '../swagger/payment-methods.swagger';
import { PaymentMethodType } from './entities/payment-method.entity';

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @FindAllPaymentMethodsDocs()
  @Get()
  async findAll(
    @Query('user_id') userId?: string,
    @Query('type') type?: PaymentMethodType,
    @Query('is_default') isDefault?: boolean,
  ) {
    const paymentMethods = await this.paymentMethodsService.findAll({
      userId,
      type,
      isDefault,
    });
    return { paymentMethods };
  }

  @FindOnePaymentMethodDocs()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paymentMethod = await this.paymentMethodsService.findOne(id);
    return { paymentMethod };
  }

  @FindUserPaymentMethodsDocs()
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('type') type?: PaymentMethodType,
  ) {
    const paymentMethods = await this.paymentMethodsService.findByUser(
      userId,
      type,
    );
    return { paymentMethods };
  }

  @CreatePaymentMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodsService.create(
      createPaymentMethodDto,
    );
    return {
      paymentMethod,
      message: 'Payment method created successfully',
    };
  }

  @UpdatePaymentMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    const paymentMethod = await this.paymentMethodsService.update(
      id,
      updatePaymentMethodDto,
    );
    return {
      paymentMethod,
      message: 'Payment method updated successfully',
    };
  }

  @DeletePaymentMethodDocs()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentMethodsService.remove(id);
    return { message: 'Payment method deleted successfully' };
  }
}
