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
import { MikroORM } from '@mikro-orm/core';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchIndex } from 'src/elaticsearch/services/elasticsearch-initialization.service';
import { ElasticsearchMovieDocument } from 'src/elaticsearch/elasticsearch.types';

@Injectable()
export class MovieService extends BaseComparableService<Movie> {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private movieRepository: MovieRepository,
    private movieTranslationRepository: MovieTranslationRepository,
    private movieGenreTranslationRepository: MovieGenreTranslationRepository,
    private tmdbUtilService: TmdbUtilService,
    private elasticSearchService: ElasticsearchService,
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

  async keywordSearch(keyword: string, languageIsoCodes?: LanguageISOCodes) {
    const res =
      await this.elasticSearchService.search<ElasticsearchMovieDocument>({
        index: ElasticsearchIndex.Movie,
        query: {
          multi_match: {
            type: 'phrase', // reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#multi-match-types
            query: keyword,
            fields: ['title', 'originalTitle', 'translation.*'],
          },
        },
        // highlight: {
        //   fields: {
        //     title: {},
        //     originalTitle: {},
        //     'translation.*': {},
        //   },
        // },
      });

    console.log(JSON.stringify(res, null, 2));

    const searchResults = res.hits.hits.map((hit) => {
      let translatedTitle = null;
      const translation = hit._source?.translation;

      if (languageIsoCodes && translation) {
        if (languageIsoCodes.iso31661) {
          // Both ISO-639-1 (Language code) and ISO-3166-1 (Coutnry code) is given
          translatedTitle =
            translation[
              `${languageIsoCodes.iso6391}-${languageIsoCodes.iso31661}`
            ];
        } else {
          // Only ISO-639-1 (Language code) is given
          const translationKey = Object.keys(translation).find((key) =>
            key.startsWith(languageIsoCodes.iso6391),
          );
          if (translationKey) translatedTitle = translation[translationKey];
        }
      }

      return {
        id: Number(hit._id),
        title: hit._source?.title,
        originalTitle: hit._source?.originalTitle,
        translatedTitle: translatedTitle,
      };
    });
    return searchResults;
  }
}
