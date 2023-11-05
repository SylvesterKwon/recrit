import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { UserId } from 'src/common/decorators/user.decorator';
import { ComparisonApplication } from './comparison.application';
import { CreateComparisonDto } from './dto/create-comparison.dto';

@Controller('comparison')
export class ComparisonController {
  constructor(private comparisonApplication: ComparisonApplication) {}

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
}
