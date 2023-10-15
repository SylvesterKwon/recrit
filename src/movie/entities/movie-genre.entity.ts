import { Entity, Property, Unique } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { MovieGenreRepository } from '../movie-genre.repository';

@Entity({ customRepository: () => MovieGenreRepository })
export class MovieGenre extends TimestampedEntity {
  @Property()
  @Unique()
  tmdbId: number;

  // TODO: 다국어 지원 schema 사용시 deprecate
  @Property()
  name: string;
}
