import { Controller, Get, UseGuards, Request, Query, Logger } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { MetricsService } from '../metrics/metrics.service';
import { MetricsResultDto } from '../metrics/dto/metrics-result.dto';

@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);
  
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getMetrics(@Request() req, @Query('period') period: string = 'month'): Promise<MetricsResultDto> {
    try {
      const userId = req.user.id;
      this.logger.log(`Solicitud de métricas para usuario: ${userId}, período: ${period}`);
      
      const result = await this.metricsService.getMetrics(userId, period);
      
      this.logger.debug('Métricas generadas correctamente');
      return result;
    } catch (error) {
      this.logger.error(`Error al procesar solicitud de métricas: ${error.message}`);
      throw error;
    }
  }
} 