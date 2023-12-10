import { Controller, Get, Param } from '@nestjs/common';
import { ComparableApplication } from './comparable.application';
import { Language } from 'src/common/decorators/language.decorator';
import { LanguageISOCodes } from 'src/common/types/iso.types';

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
}
