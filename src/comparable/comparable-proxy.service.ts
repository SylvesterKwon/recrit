import { Injectable, NotImplementedException } from '@nestjs/common';
import { ComparableType } from './types/comparable.types';
import { EntityManager } from '@mikro-orm/core';
import { MovieService } from 'src/movie/movie.service';
import { BaseComparableService } from 'src/common/services/base-comparable.service';
import { ComparableNotFoundException } from 'src/common/exceptions/comparable.exception';

/**
 * This service is responsible for proxying the comparable service
 */
@Injectable()
export class ComparableProxyService {
  constructor(private em: EntityManager, private movieService: MovieService) {}

  isValidComparableType(type: string): type is ComparableType {
    return Object.values(ComparableType).includes(type as ComparableType);
  }

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

  async getComparableInformation(comparableType: ComparableType, id: number) {
    const comparableService = this.getComparableService(comparableType);
    const comparable = await this.getComparable(comparableType, id);
    if (!comparable) throw new ComparableNotFoundException();

    return await comparableService.getInformation(comparable);
  }
}
