import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ComparisonApplication } from './comparison.application';
import { ComparableType } from './entities/comparison.entity';
import { PermissionRequired } from 'src/common/decorators/auth.decorator';
import { RequestWithUserInfo } from 'src/common/types/auth.types';
import { MakeComparisonDto } from './dto/make-comparison.dto';

@Controller('comparison')
export class ComparisonController {
  constructor(private comparisonApplication: ComparisonApplication) {}

  @PermissionRequired('make_comparison') // TODO: 임시 권한, 변경 필요
  @Post(':comparableType/make-comparison')
  async makeComparison(
    @Request() req: RequestWithUserInfo,
    @Param('comparableType') comparableType: ComparableType,
    @Body() dto: MakeComparisonDto,
  ) {
    console.log(dto);
    await this.comparisonApplication.makeComparison(
      req.user,
      comparableType,
      dto.firstItemId,
      dto.secondItemId,
      dto.verdict,
    );
  }
}
