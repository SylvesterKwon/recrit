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

export type MovieFilter = {
  genreIds?: number[];
  page?: number;
  pageSize?: number;
};

export type MovieInformation = {
  id: number;
  tmdbId: number;
  adult?: boolean;
  backdropUrl?: string;
  budget?: number;
  homepage?: string;
  imdbId?: string;
  originalLanguage?: string;
  originalTitle?: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: Date;
  revenue?: number;
  runtime?: number;
  status?: MovieStatus;
  tagline?: string;
  title?: string;
  video?: boolean;
  genres: { genreId: number; name: string }[];
  productionCountryCodes?: string[]; // TODO: type this with ISO 3166-1 code
  spokenLanguageCodes?: string[]; // TODO: types this with ISO 639-1 code
};

export type MovieSummaryForList = {
  id: number;
  posterUrl?: string;
  releaseDate?: Date;
  title?: string;
};
