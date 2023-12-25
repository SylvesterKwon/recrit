import { Injectable, NotImplementedException } from '@nestjs/common';
import { ComparableType, ConsumptionStatus } from '../types/comparable.types';
import { EntityManager } from '@mikro-orm/core';
import { MovieService } from 'src/movie/services/movie.service';
import { ComparableNotFoundException } from 'src/common/exceptions/comparable.exception';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { User } from 'src/user/entities/user.entity';

/**
 * This service is responsible for proxying the comparable service
 */
@Injectable()
export class ComparableProxyService {
  constructor(private em: EntityManager, private movieService: MovieService) {}

  private getComparableService(type: ComparableType) {
    if (type === ComparableType.MOVIE) return this.movieService;
    // else if ...
    else
      throw new NotImplementedException("Given comparable type doesn't exist");
  }

  async getComparable(comparableType: ComparableType, id: number) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.em.findOne(
      comparableService.comparableEntity,
      id,
    );
    if (!comparable) throw new ComparableNotFoundException();
    return comparable;
  }

  async getComparableInformation(
    comparableType: ComparableType,
    comparableId: number,
    languageIsoCodes?: LanguageISOCodes,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);

    return await comparableService.getInformation(comparable, languageIsoCodes);
  }

  async consumeComparable(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ): Promise<ConsumptionStatus> {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);

    return await comparableService.consume(user, comparable);
  }

  async unconsumeComparable(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ): Promise<ConsumptionStatus> {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);

    return await comparableService.unconsume(user, comparable);
  }

  async addToConsumeList(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ): Promise<ConsumptionStatus> {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);

    return await comparableService.addToConsumeList(user, comparable);
  }

  async removeToConsumeList(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ): Promise<ConsumptionStatus> {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);

    return await comparableService.removeToConsumeList(user, comparable);
  }

  async getConsumptionStatuses(
    user: User,
    comparableType: ComparableType,
    comparableIds: number[],
  ) {
    const comparableService = this.getComparableService(comparableType);
    return await comparableService.getConsumptionStatuses(user, comparableIds);
  }
}
