export type TmdbMovieIdResponse = {
  adult: boolean;
  id: number;
  original_title: string;
  popularity: number;
  video: boolean;
};

/**
 * moviedb-promise's type declaration is not correct (tagline is missing)
 * so we need to add it manually
 */
export type MovieTranslationsResponseWithTagline = {
  id: number;
  translations: {
    iso_3166_1: string;
    iso_639_1: string;
    data: {
      homepage?: string;
      overview?: string;
      tagline?: string;
      title?: string;
    };
  }[];
};
