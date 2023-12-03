import { Injectable } from '@nestjs/common';
import { BaseComparableService } from 'src/common/services/base-comparable.service';
import { Movie } from './entities/movie.entity';
import { MovieInformation } from './types/movie.types';
import { MovieRepository } from './movie.repository';
import { TmdbUtilService } from 'src/tmdb/tmdb-util.service';

@Injectable()
export class MovieService extends BaseComparableService {
  constructor(
    private movieRepository: MovieRepository,
    private tmdbUtilService: TmdbUtilService,
  ) {
    super();
  }

  get relatedEntity() {
    return Movie;
  }

  async getInformation(movie: Movie): Promise<MovieInformation> {
    await movie.genres.init();
    const movieGenres = movie.genres.getItems();
    const backdropUrl = movie.backdropPath
      ? this.tmdbUtilService.getBackdropUrl(movie.backdropPath)
      : undefined;
    const posterUrl = movie.posterPath
      ? this.tmdbUtilService.getPosterUrl(movie.posterPath)
      : undefined;

    return {
      id: movie.id,
      tmdbId: movie.tmdbId,
      adult: movie.adult,
      backdropUrl: backdropUrl,
      budget: movie.budget,
      homepage: movie.homepage,
      imdbId: movie.imdbId,
      originalLanguage: movie.originalLanguage,
      originalTitle: movie.originalTitle,
      overview: movie.overview,
      posterUrl: posterUrl,
      releaseDate: movie.releaseDate,
      revenue: movie.revenue,
      runtime: movie.runtime,
      status: movie.status,
      tagline: movie.tagline,
      title: movie.title,
      video: movie.video,
      genreIds: movieGenres.map((genre) => genre.tmdbId),
      productionCountryCodes: movie.productionCountryCodes,
      spokenLanguageCodes: movie.spokenLanguageCodes,
    };
  }
}
