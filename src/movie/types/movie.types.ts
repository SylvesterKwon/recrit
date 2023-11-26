import { Movie } from '../entities/movie.entity';

export type MovieStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';

export type MovieRelations = {
  genreTmdbIds: number[];
  productionCompanyTmdbIds: number[];
};

export type MovieInformation = Movie; // TODO: type this as subset of Movie
