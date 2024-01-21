import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { UserId } from 'src/common/decorators/user.decorator';
import { ComparisonApplication } from './comparison.application';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ComparisonCreatedEvent } from './events/comparison-created.event';
import { ComparisonTask } from './comparison.task';

@Controller('comparison')
export class ComparisonController {
  constructor(
    private comparisonApplication: ComparisonApplication,
    private comparisonTask: ComparisonTask,
  ) {}

  @AuthenticationRequired()
  @Post()
  async createComparison(
    @UserId() userId: number,
    @Body() createComparisonDto: CreateComparisonDto,
  ) {
    return await this.comparisonApplication.createComparison(
      userId,
      createComparisonDto.comparableType,
      createComparisonDto.firstItemId,
      createComparisonDto.secondItemId,
      createComparisonDto.verdict,
    );
  }

  @EventPattern('comparison.created')
  async comparisonCreated(@Payload() event: ComparisonCreatedEvent) {
    return await this.comparisonTask.handleComparisonCreatedEvent(event);
  }
}
