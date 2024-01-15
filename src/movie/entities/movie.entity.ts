import {
  ArrayType,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
  t,
} from '@mikro-orm/core';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieStatus } from '../types/movie.types';
import { Comparable } from 'src/common/entities/comparable.entity';
import { ComparableType } from 'src/comparable/types/comparable.types';
import { MovieGenre } from './movie-genre.entity';
import { ISO31661, ISO6391 } from 'src/common/types/iso.types';
import { MovieTranslation } from './movie-translation.entity';
import { User } from 'src/user/entities/user.entity';

// not using popularity, voteAverage, voteCount from original TMDB data

@Entity({ repository: () => MovieRepository })
export class Movie extends Comparable {
  get type() {
    return ComparableType.MOVIE;
  }

  @Property()
  @Unique()
  tmdbId: number;

  @Property()
  adult?: boolean;

  @Property()
  backdropPath?: string;

  // @Property()
  // belongsToCollection?: object;

  @Property({ type: t.bigint })
  budget?: number;

  @Property()
  homepage?: string;

  @Property()
  imdbId?: string;

  @Property()
  originalLanguage?: string;

  @Property()
  originalTitle?: string;

  // reference: https://www.themoviedb.org/talk/5b59e5a09251414d1b012d9b
  @Property({ length: 1000 })
  overview?: string;

  @Property()
  posterPath?: string;

  @Property()
  releaseDate?: Date;

  @Property({ type: t.bigint })
  revenue?: number;

  @Property()
  runtime?: number;

  @Property()
  status?: MovieStatus;

  @Property({ length: 500 })
  tagline?: string;

  @Property()
  title?: string;

  @Property()
  video?: boolean;

  @ManyToMany()
  genres = new Collection<MovieGenre>(this);

  @OneToMany(() => MovieTranslation, (translation) => translation.movie, {
    orphanRemoval: true,
  })
  translations = new Collection<MovieTranslation>(this);

  // TODO: Add production company property
  // @Property({ type: ArrayType })
  // productionCompanyIds: ProductionCompany[];

  @Property({ type: ArrayType })
  productionCountryCodes: ISO31661[];

  @Property({ type: ArrayType })
  spokenLanguageCodes: ISO6391[];

  @ManyToMany(() => User, (user) => user.consumedMovies)
  consumedUsers = new Collection<User>(this);

  @ManyToMany(() => User, (user) => user.toConsumeMovieList)
  toConsumeListedUsers = new Collection<User>(this);
}
