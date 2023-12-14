import { Controller, Get, Param, Post } from '@nestjs/common';
import { ComparableApplication } from './comparable.application';
import { Language } from 'src/common/decorators/language.decorator';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserId } from 'src/common/decorators/user.decorator';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';

@Controller('comparable')
export class ComparableController {
  constructor(private comparableApplication: ComparableApplication) {}

  @Get(':comparableType/:comparableId')
  async getComparableInforamtion(
    @Param('comparableType') comparableType: string,
    @Param('comparableId') comparableId: number,
    @Language() language?: LanguageISOCodes,
  ) {
    return await this.comparableApplication.getComparableInforamtion(
      comparableType,
      comparableId,
      language,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/consume')
  async consumeComparable(
    @UserId() userId: number,
    @Param('comparableType') comparableType: string,
    @Param('comparableId') comparableId: number,
  ) {
    return await this.comparableApplication.consumeComparable(
      userId,
      comparableType,
      comparableId,
    );
  }
}
