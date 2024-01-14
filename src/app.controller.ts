import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('RECRIT_SERVICE') private kafkaClient: ClientKafka) {}
  @Get('health-check')
  healthCheck() {
    return 'healthy!';
  }

  // Kafka event POC
  @Get('emit-test')
  emitTest() {
    this.kafkaClient.emit('test', { test: 'test' });
  }

  @EventPattern('test')
  mesageTest(@Payload() message: any) {
    console.log(message);
  }
}
