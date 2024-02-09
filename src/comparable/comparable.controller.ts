import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ComparableApplication } from './comparable.application';
import { Language } from 'src/common/decorators/language.decorator';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserId } from 'src/common/decorators/user.decorator';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import {
  ComparableDto,
  ComparableIdListDto,
  ComparableTypeDto,
} from './dtos/comparable.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ComparableConsumedEvent } from './events/comparable-consumed.event';
import { ComparableUnconsumedEvent } from './events/comparable-unconsumed.event';
import { ComparableTask } from './comparable.task';
import { ComparableUpdatedEvent } from './events/comparable-updated.event';
import { MovieApplication } from 'src/movie/movie.application';

@Controller('comparable')
export class ComparableController {
  constructor(
    private comparableApplication: ComparableApplication,
    private movieApplication: MovieApplication,
    private comparableTask: ComparableTask,
  ) {}

  // Movie specific APIs
  // TODO: 이 API는 별도의 Controller로 분리하기 또는 comparable 공통 API 로 변경하기
  @Get('movie/list')
  async getMovieList(
    @Query(
      'genreIds',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    genreIds?: number[],
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Language() language?: LanguageISOCodes,
  ) {
    return await this.movieApplication.getList(
      {
        genreIds,
        page,
        pageSize,
      },
      language,
    );
  }

  // Comparable common APIs
  @Get(':comparableType/keyword-search')
  async keywordSearch(
    @Param() comparableTypeDto: ComparableTypeDto,
    @Query('keyword') keyword: string,
    @Language() language?: LanguageISOCodes,
  ) {
    return await this.comparableApplication.keywordSearch(
      comparableTypeDto.comparableType,
      keyword,
      language,
    );
  }

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
    @Body() comparableIdListDto: ComparableIdListDto, // TODO: get 사용하도록 수정
  ) {
    return await this.comparableApplication.getConsumptionStatuses(
      userId,
      comparableTypeDto.comparableType,
      comparableIdListDto.comparableIds,
    );
  }

  // Event handlers
  // TODO: 이벤트 핸들러는 별도의 Controller로 분리하기
  @EventPattern('comparable.updated')
  async comparableUpdated(@Payload() event: ComparableUpdatedEvent) {
    return await this.comparableTask.handleComparableUpdated(
      event.comparableType,
      event.comparableId,
      event.title,
    );
  }

  @EventPattern('comparable.consumed')
  async comparableConsumed(@Payload() event: ComparableConsumedEvent) {
    return await this.comparableTask.handleComparableConsumed(
      event.userId,
      event.comparableType,
      event.comparableId,
    );
  }

  @EventPattern('comparable.unconsumed')
  async comparableUnconsumed(@Payload() event: ComparableUnconsumedEvent) {
    return await this.comparableTask.handleComparableUnconsumed(
      event.userId,
      event.comparableType,
      event.comparableId,
    );
  }
}
