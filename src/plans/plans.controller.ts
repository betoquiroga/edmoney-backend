import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  CreatePlanDocs,
  DeletePlanDocs,
  FindAllPlansDocs,
  FindOnePlanDocs,
  UpdatePlanDocs,
} from '../swagger/plans.swagger';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { IPlanResponse, IPlansResponse } from './interfaces/plan.interface';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @UseGuards(JwtGuard)
  @FindAllPlansDocs()
  async findAll(): Promise<IPlansResponse> {
    const plans = await this.plansService.findAll();
    return { plans };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @FindOnePlanDocs()
  async findOne(@Param('id') id: string): Promise<IPlanResponse> {
    const plan = await this.plansService.findById(id);
    return { plan };
  }

  @Post()
  @UseGuards(JwtGuard)
  @CreatePlanDocs()
  async create(@Body() createPlanDto: CreatePlanDto): Promise<IPlanResponse> {
    const plan = await this.plansService.create(createPlanDto);
    return { plan, message: 'Plan created successfully' };
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UpdatePlanDocs()
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<IPlanResponse> {
    const plan = await this.plansService.update(id, updatePlanDto);
    return { plan, message: 'Plan updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @DeletePlanDocs()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.plansService.remove(id);
    return { message: 'Plan deleted successfully' };
  }
}
