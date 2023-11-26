import { Controller, Get, Param } from '@nestjs/common';
import { ComparableApplication } from './comparable.application';

@Controller('comparable')
export class ComparableController {
  constructor(private comparableApplication: ComparableApplication) {}

  @Get(':comparableType/:comparableId')
  async getComparableInforamtion(
    @Param('comparableType') comparableType: string,
    @Param('comparableId') comparableId: number,
  ) {
    return await this.comparableApplication.getComparableInforamtion(
      comparableType,
      comparableId,
    );
  }
}
