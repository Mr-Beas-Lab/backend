import { Controller, Get, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  checkHealth() {
    this.logger.log('Health check hit');

    return {
      status: 'ok',
      message: 'Service is healthy ✅',
      timestamp: new Date().toISOString(),
    };
  }
}
