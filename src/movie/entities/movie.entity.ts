import { Collection, Entity, ManyToMany, Property, t } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { MovieRepository } from '../movie.repository';
import { MovieGenre } from './movie-genre.entity';
import { Create } from 'src/common/types/entity.types';
import { MovieStatus } from '../types/movie.types';

// not using popularity, voteAverage, voteCount from original TMDB data

@Entity({ customRepository: () => MovieRepository })
export class Movie extends TimestampedEntity {
  @Property()
  tmdbId: number;

  @Property()
  adult?: boolean;

  @Property()
  backdropPath?: string;

  // @Property()
  // belongsToCollection?: object;

  @Property({ type: t.bigint })
  budget?: number;

  @ManyToMany()
  genres = new Collection<MovieGenre>(this);

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

  // @Property()
  // productionCompanies?: Array<ProductionCompany>;

  // @Property()
  // productionCountries?: Array<ProductionCountry>;

  @Property()
  releaseDate?: Date;

  @Property({ type: t.bigint })
  revenue?: number;

  @Property()
  runtime?: number;

  // @Property()
  // spokenLanguages?: Array<SpokenLanguage>;

  @Property()
  status?: MovieStatus;

  @Property({ length: 500 })
  tagline?: string;

  @Property()
  title?: string;

  @Property()
  video?: boolean;

  constructor(props: Create<Movie>) {
    super();
    this.tmdbId = props.tmdbId;
    this.adult = props.adult;
    this.backdropPath = props.backdropPath;
    this.budget = props.budget;
    this.homepage = props.homepage;
    this.imdbId = props.imdbId;
    this.originalLanguage = props.originalLanguage;
    this.originalTitle = props.originalTitle;
    this.overview = props.overview;
    this.posterPath = props.posterPath;
    this.releaseDate = props.releaseDate;
    this.revenue = props.revenue;
    this.runtime = props.runtime;
    this.status = props.status;
    this.tagline = props.tagline;
    this.title = props.title;
    this.video = props.video;
  }
}
