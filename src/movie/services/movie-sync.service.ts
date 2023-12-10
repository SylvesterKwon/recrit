import { Injectable } from '@nestjs/common';
import { TmdbClientService } from 'src/tmdb/services/tmdb-client.service';
import { MovieGenreRepository } from '../repositories/movie-genre.repository';
import dayjs from 'dayjs';
import { MovieRepository } from '../repositories/movie.repository';
import { ISO6391 } from 'src/common/types/iso.types';
import { delay } from 'src/common/utils/delay';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { ComparableType } from 'src/comparable/types/comparable.types';
import { MovieTranslationRepository } from '../repositories/movie-translation.repository';

@Injectable()
export class MovieSyncService {
  constructor(
    private tmdbClientService: TmdbClientService,
    private movieRepository: MovieRepository,
    private movieGenreRepository: MovieGenreRepository,
    private movieTranslationRepository: MovieTranslationRepository,
    private graphRepository: GraphRepository,
  ) {}

  async syncAllMovies() {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    let validTmdbMovieIds =
      await this.tmdbClientService.getValidTmdbMovieIdsByDate(yesterday);

    // TODO: remove this line
    validTmdbMovieIds = validTmdbMovieIds.slice(0, 100);

    const chunkSize = 50;
    const intervalMilliseconds = 1200;
    const maxTryCount = 3;

    const chunks: number[][] = [];
    for (let i = 0; i < validTmdbMovieIds.length; i += chunkSize) {
      chunks.push(validTmdbMovieIds.slice(i, i + chunkSize));
    }

    let goodChunkCount = 0;
    let badChunkCount = 0;
    const errorLog = [];

    for await (const chunk of chunks) {
      try {
        for (let i = 0; i < maxTryCount; i++) {
          await Promise.all(
            chunk.map((tmdbId) => {
              return this.syncMovieByTmdbId(tmdbId);
            }),
          );
          goodChunkCount++;
          break;
        }
      } catch (err) {
        errorLog.push(err);
        badChunkCount++;
      }
      await delay(intervalMilliseconds);
    }

    // TODO: remove following lines
    console.log('=========== sync report ===========');
    console.log('goodChunkCount:', goodChunkCount);
    console.log('badChunkCount:', badChunkCount);
    console.log('errorLog:', errorLog);
  }

  async syncMovieByTmdbId(tmdbId: number) {
    try {
      const tmdbMovieData = await this.tmdbClientService.getMovie(tmdbId);
      const movieTranslationDataList =
        await this.tmdbClientService.getMovieTranslations(tmdbId);

      const movie = await this.movieRepository.upsert(tmdbMovieData.movieProps);

      // sync movie translations
      await this.movieTranslationRepository.upsertManyByMovieAndIsoCodes(
        movie,
        movieTranslationDataList,
      );

      // sync movie genres
      const genres = await this.movieGenreRepository.findByTmdbIds(
        tmdbMovieData.movieRelations.genreTmdbIds,
      );
      movie.genres.set(genres);

      const em = this.movieRepository.getEntityManager();
      await em.flush();

      await this.graphRepository.upsertComparable(
        ComparableType.MOVIE,
        movie.id,
        movie.title,
      );

      return movie;
    } catch (err) {
      // TODO: add sync error log table
      console.log('error tmdb id: ', tmdbId);
      console.error(err);
    }
  }

  async syncMovieGenresByLanguage(language: ISO6391) {
    const tmdbMovieGenresData = await this.tmdbClientService.getAllMovieGenres(
      language,
    );

    await Promise.all(
      tmdbMovieGenresData.map((tmdbMovieGenreData) => {
        return this.movieGenreRepository.upsert(tmdbMovieGenreData);
      }),
    );
  }
}
