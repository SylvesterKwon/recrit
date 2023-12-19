import { Injectable, NotImplementedException } from '@nestjs/common';
import { ComparableType } from '../types/comparable.types';
import { EntityManager } from '@mikro-orm/core';
import { MovieService } from 'src/movie/services/movie.service';
import { BaseComparableService } from 'src/common/services/base-comparable.service';
import { ComparableNotFoundException } from 'src/common/exceptions/comparable.exception';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { User } from 'src/user/entities/user.entity';

/**
 * This service is responsible for proxying the comparable service
 */
@Injectable()
export class ComparableProxyService {
  constructor(private em: EntityManager, private movieService: MovieService) {}

  private getComparableService(type: ComparableType): BaseComparableService {
    if (type === ComparableType.MOVIE) return this.movieService;
    // else if ...
    else
      throw new NotImplementedException("Given comparable type doesn't exist");
  }

  async getComparable(comparableType: ComparableType, id: number) {
    const comparableService = this.getComparableService(comparableType);
    return await this.em.findOne(comparableService.relatedEntity, id);
  }

  async getComparableInformation(
    comparableType: ComparableType,
    comparableId: number,
    languageIsoCodes?: LanguageISOCodes,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);
    if (!comparable) throw new ComparableNotFoundException();

    // TODO: Add if statement for comparable that doesn't support translation
    return await comparableService.getInformation(comparable, languageIsoCodes);
  }

  async consumeComparable(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);
    if (!comparable) throw new ComparableNotFoundException();

    return comparableService.consume(user, comparable);
  }

  async unconsumeComparable(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);
    if (!comparable) throw new ComparableNotFoundException();

    return comparableService.unconsume(user, comparable);
  }

  async addToConsumeList(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);
    if (!comparable) throw new ComparableNotFoundException();

    return comparableService.addToConsumeList(user, comparable);
  }

  async removeToConsumeList(
    user: User,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, comparableId);
    if (!comparable) throw new ComparableNotFoundException();

    return comparableService.removeToConsumeList(user, comparable);
  }
}
