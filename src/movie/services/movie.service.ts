import { Injectable } from '@nestjs/common';
import { BaseComparableService } from 'src/comparable/services/base-comparable.service';
import { Movie } from '../entities/movie.entity';
import { MovieInformation } from '../types/movie.types';
import { MovieRepository } from '../repositories/movie.repository';
import { TmdbUtilService } from 'src/tmdb/services/tmdb-util.service';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { MovieTranslationRepository } from '../repositories/movie-translation.repository';
import { MovieGenreTranslationRepository } from '../repositories/movie-genre-translation.repository';
import { MovieGenreTranslation } from '../entities/movie-genre-translation.entity';
import { User } from 'src/user/entities/user.entity';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class MovieService extends BaseComparableService<Movie> {
  constructor(
    protected orm: MikroORM,
    protected graphRepository: GraphRepository,
    private movieRepository: MovieRepository,
    private movieTranslationRepository: MovieTranslationRepository,
    private movieGenreTranslationRepository: MovieGenreTranslationRepository,
    private tmdbUtilService: TmdbUtilService,
  ) {
    super();
  }
  get comparableEntity() {
    return Movie;
  }

  getUserConsumedComparables(user: User) {
    return user.consumedMovies;
  }

  getUserToConsumeComparableList(user: User) {
    return user.toConsumeMovieList;
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

    let movieTranslation = null;
    let movieGenreTranslations: MovieGenreTranslation[] | null = null;

    if (languageIsoCodes) {
      if (languageIsoCodes.iso31661) {
        movieTranslation = await this.movieTranslationRepository.findOne({
          movie: movie,
          iso6391: languageIsoCodes?.iso6391,
          iso31661: languageIsoCodes?.iso31661,
        });
      } else {
        movieTranslation = await this.movieTranslationRepository.findOne({
          movie: movie,
          iso6391: languageIsoCodes?.iso6391,
        });
      }
      movieGenreTranslations = await this.movieGenreTranslationRepository.find({
        iso6391: languageIsoCodes?.iso6391,
        movieGenre: { $in: movieGenres },
      });
    }

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
      genres: movieGenres.map((genre) => {
        const movieGenreTranslation = movieGenreTranslations?.find(
          (movieGenreTranslation) =>
            movieGenreTranslation.movieGenre.id === genre.id,
        );
        return {
          genreId: genre.id,
          name: movieGenreTranslation?.name
            ? movieGenreTranslation.name
            : genre.name,
        };
      }),
      productionCountryCodes: movie.productionCountryCodes,
      spokenLanguageCodes: movie.spokenLanguageCodes,
    };
  }
}
