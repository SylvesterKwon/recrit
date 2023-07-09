import { Injectable } from '@nestjs/common';
import { TmdbClientService } from 'src/tmdb-client/tmdb-client.service';
import { MovieGenreRepository } from './movie-genre.repository';
import dayjs from 'dayjs';
import { MovieRepository } from './movie.repository';
import { ISO6391 } from 'src/common/types/iso-639-1.types';
import { delay } from 'src/common/utils/delay';

@Injectable()
export class MovieSyncService {
  constructor(
    private tmdbClientService: TmdbClientService,
    private movieRepository: MovieRepository,
    private movieGenreRepository: MovieGenreRepository,
  ) {}

  async syncAllMovies() {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    let validTmdbMovieIds =
      await this.tmdbClientService.getValidTmdbMovieIdsByDate(yesterday);

    // TODO: remove this line
    validTmdbMovieIds = validTmdbMovieIds.slice(0, 75);

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
      const movieUpsertPropsWithRelation =
        await this.tmdbClientService.getMovie(tmdbId);

      const movie = await this.movieRepository.upsertByTmdbId(
        movieUpsertPropsWithRelation,
      );
      const genres = await this.movieGenreRepository.findByTmdbIds(
        movieUpsertPropsWithRelation.genreTmdbIds,
      );

      movie.genres.set(genres);
      return movie;
    } catch (err) {
      console.log('error tmdb id: ', tmdbId);
      console.error(err);
    }
  }

  async syncMovieGenresByLanguage(language: ISO6391) {
    const movieGenreUpsertDataList =
      await this.tmdbClientService.getAllMovieGenres(language);

    return await this.movieGenreRepository.upsertManyByTmdbId(
      movieGenreUpsertDataList,
    );
  }
}
