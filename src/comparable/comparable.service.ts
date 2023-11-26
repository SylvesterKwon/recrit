import { Injectable, NotImplementedException } from '@nestjs/common';
import { ComparableType } from './types/comparable.types';
import { Movie } from 'src/movie/entities/movie.entity';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class ComparableService {
  constructor(private em: EntityManager) {}

  async getComparable(type: ComparableType, id: number) {
    const comparable = await this.comparableTypeToComparable(type);
    return await this.em.findOne(comparable, id);
  }

  private async comparableTypeToComparable(type: ComparableType) {
    if (type === ComparableType.MOVIE) return Movie;
    // else if ...
    else
      throw new NotImplementedException("Given comparable type doesn't exist");
  }
}
