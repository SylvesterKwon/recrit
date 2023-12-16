import { Controller, Get, Param, Post } from '@nestjs/common';
import { ComparableApplication } from './comparable.application';
import { Language } from 'src/common/decorators/language.decorator';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserId } from 'src/common/decorators/user.decorator';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import {
  ConsumeComparableDto,
  GetComparableInformationDto,
} from './comparable.dto';

@Controller('comparable')
export class ComparableController {
  constructor(private comparableApplication: ComparableApplication) {}

  @Get(':comparableType/:comparableId')
  async getComparableInforamtion(
    @Param() dto: GetComparableInformationDto,
    @Language() language?: LanguageISOCodes,
  ) {
    return await this.comparableApplication.getComparableInforamtion(
      dto.comparableType,
      dto.comparableId,
      language,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/consume')
  async consumeComparable(
    @UserId() userId: number,
    @Param() dto: ConsumeComparableDto,
  ) {
    return await this.comparableApplication.consumeComparable(
      userId,
      dto.comparableType,
      dto.comparableId,
    );
  }
}
