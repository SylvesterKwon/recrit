import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { MovieGenreRepository } from '../repositories/movie-genre.repository';
import { Movie } from './movie.entity';
import { MovieGenreTranslation } from './movie-genre-translation.entity';

@Entity({ customRepository: () => MovieGenreRepository })
export class MovieGenre extends TimestampedEntity {
  @Property()
  @Unique()
  tmdbId: number;

  @Property()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies = new Collection<Movie>(this);

  @OneToMany(
    () => MovieGenreTranslation,
    (translation) => translation.movieGenre,
    {
      orphanRemoval: true,
    },
  )
  translations = new Collection<MovieGenreTranslation>(this);
}
