import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ComparableApplication } from './comparable.application';
import { Language } from 'src/common/decorators/language.decorator';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserId } from 'src/common/decorators/user.decorator';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import {
  ComparableDto,
  ComparableIdListDto,
  ComparableTypeDto,
} from './comparable.dto';

@Controller('comparable')
export class ComparableController {
  constructor(private comparableApplication: ComparableApplication) {}

  @Get(':comparableType/:comparableId')
  async getComparableInforamtion(
    @Param() comparableDto: ComparableDto,
    @Language() language?: LanguageISOCodes,
  ) {
    return await this.comparableApplication.getComparableInforamtion(
      comparableDto.comparableType,
      comparableDto.comparableId,
      language,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/consume')
  async consumeComparable(
    @UserId() userId: number,
    @Param() comparableDto: ComparableDto,
  ) {
    return await this.comparableApplication.consumeComparable(
      userId,
      comparableDto.comparableType,
      comparableDto.comparableId,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/unconsume')
  async unconsumeComparable(
    @UserId() userId: number,
    @Param() comparableDto: ComparableDto,
  ) {
    return await this.comparableApplication.unconsumeComparable(
      userId,
      comparableDto.comparableType,
      comparableDto.comparableId,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/add-to-consume-list')
  async addToConsumeList(
    @UserId() userId: number,
    @Param() comparableDto: ComparableDto,
  ) {
    return await this.comparableApplication.addToConsumeList(
      userId,
      comparableDto.comparableType,
      comparableDto.comparableId,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/:comparableId/remove-to-consume-list')
  async removeToConsumeList(
    @UserId() userId: number,
    @Param() comparableDto: ComparableDto,
  ) {
    return await this.comparableApplication.removeToConsumeList(
      userId,
      comparableDto.comparableType,
      comparableDto.comparableId,
    );
  }

  @AuthenticationRequired()
  @Post(':comparableType/consumption-statuses')
  async getConsumptionStatuses(
    @UserId() userId: number,
    @Param() comparableTypeDto: ComparableTypeDto,
    @Body() comparableIdListDto: ComparableIdListDto,
  ) {
    return await this.comparableApplication.getConsumptionStatuses(
      userId,
      comparableTypeDto.comparableType,
      comparableIdListDto.comparableIds,
    );
  }
}
