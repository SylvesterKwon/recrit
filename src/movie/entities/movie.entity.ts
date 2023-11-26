import { ArrayType, Entity, Property, Unique, t } from '@mikro-orm/core';
import { MovieRepository } from '../movie.repository';
import { MovieStatus } from '../types/movie.types';
import { Comparable } from 'src/comparable/comparable.entity';
import { ComparableType } from 'src/comparable/types/comparable.types';

// not using popularity, voteAverage, voteCount from original TMDB data

@Entity({ customRepository: () => MovieRepository })
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

  @Property({ type: ArrayType, nullable: true })
  genreIds?: number[];

  // TODO: Add production company property
  // @Property({ type: ArrayType, nullable: true })
  // productionCompanyIds?: ProductionCompany[];

  // TODO: type this with ISO 3166-1 code
  @Property({ type: ArrayType, nullable: true })
  productionCountryCodes?: string[];

  // TODO: types this with ISO 639-1 code
  @Property({ type: ArrayType, nullable: true })
  spokenLanguageCodes?: string[];
}
