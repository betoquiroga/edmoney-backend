import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiResponse({
    status: 200,
    description: 'API and database are working correctly',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-05-17T12:00:00.000Z' },
        database: { type: 'boolean', example: true },
        message: { type: 'string', example: 'API is healthy' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'API or database is not working correctly',
  })
  async checkHealth() {
    return this.appService.checkHealth();
  }
}
