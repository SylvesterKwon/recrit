import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { MovieGenreRepository } from '../repositories/movie-genre.repository';
import { Movie } from './movie.entity';

@Entity({ customRepository: () => MovieGenreRepository })
export class MovieGenre extends TimestampedEntity {
  @Property()
  @Unique()
  tmdbId: number;

  // TODO: 다국어 지원 schema 사용시 deprecate
  @Property()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies = new Collection<Movie>(this);
}
