import { Injectable } from '@nestjs/common';
import { BaseComparableService } from 'src/common/services/base-comparable.service';
import { Movie } from '../entities/movie.entity';
import { MovieInformation } from '../types/movie.types';
import { MovieRepository } from '../repositories/movie.repository';
import { TmdbUtilService } from 'src/tmdb/services/tmdb-util.service';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { MovieTranslationRepository } from '../repositories/movie-translation.repository';

@Injectable()
export class MovieService extends BaseComparableService {
  constructor(
    private movieRepository: MovieRepository,
    private movieTranslationRepository: MovieTranslationRepository,
    private tmdbUtilService: TmdbUtilService,
  ) {
    super();
  }

  get relatedEntity() {
    return Movie;
  }

  async getInformation(
    movie: Movie,
    languageIsoCodes?: LanguageISOCodes,
  ): Promise<MovieInformation> {
    await movie.genres.init();
    const movieGenres = movie.genres.getItems();
    const backdropUrl = movie.backdropPath
      ? this.tmdbUtilService.getBackdropUrl(movie.backdropPath)
      : undefined;
    const posterUrl = movie.posterPath
      ? this.tmdbUtilService.getPosterUrl(movie.posterPath)
      : undefined;

    const movieTranslation = await this.movieTranslationRepository.findOne({
      movie: movie,
      iso31661: languageIsoCodes?.iso31661,
      iso6391: languageIsoCodes?.iso6391,
    });

    console.log(movieTranslation);

    return {
      id: movie.id,
      tmdbId: movie.tmdbId,
      adult: movie.adult,
      backdropUrl: backdropUrl,
      budget: movie.budget,
      homepage: movieTranslation?.homepage
        ? movieTranslation.homepage
        : movie.homepage,
      imdbId: movie.imdbId,
      originalLanguage: movie.originalLanguage,
      originalTitle: movie.originalTitle,
      overview: movieTranslation?.overview
        ? movieTranslation.overview
        : movie.overview,
      posterUrl: posterUrl,
      releaseDate: movie.releaseDate,
      revenue: movie.revenue,
      runtime: movie.runtime,
      status: movie.status,
      tagline: movieTranslation?.tagline
        ? movieTranslation.tagline
        : movie.tagline,
      title: movieTranslation?.title ? movieTranslation.title : movie.title,
      video: movie.video,
      genreIds: movieGenres.map((genre) => genre.tmdbId),
      productionCountryCodes: movie.productionCountryCodes,
      spokenLanguageCodes: movie.spokenLanguageCodes,
    };
  }
}
