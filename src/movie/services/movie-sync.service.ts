import { Injectable } from '@nestjs/common';
import { TmdbClientService } from 'src/tmdb/services/tmdb-client.service';
import { MovieGenreRepository } from '../repositories/movie-genre.repository';
import dayjs from 'dayjs';
import { MovieRepository } from '../repositories/movie.repository';
import { ISO6391 } from 'src/common/types/iso.types';
import { delay } from 'src/common/utils/delay';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { MovieTranslationRepository } from '../repositories/movie-translation.repository';
import { MovieGenreTranslationRepository } from '../repositories/movie-genre-translation.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchIndex } from 'src/elaticsearch/services/elasticsearch-initialization.service';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { ComparableUpdatedEvent } from 'src/comparable/events/comparable-updated.event';

@Injectable()
export class MovieSyncService {
  constructor(
    private tmdbClientService: TmdbClientService,
    private movieRepository: MovieRepository,
    private movieGenreRepository: MovieGenreRepository,
    private movieTranslationRepository: MovieTranslationRepository,
    private movieGenreTranslationRepository: MovieGenreTranslationRepository,
    private graphRepository: GraphRepository,
    private elasticsearchService: ElasticsearchService,
    private eventManagerService: EventManagerService,
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
      } catch (error) {
        errorLog.push(error);
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
      const movieTranslations =
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

      // sync elasticsearch document
      // TODO: move elasticsearch indexing logic to MovieService
      await this.elasticsearchService.index({
        index: ElasticsearchIndex.Movie,
        id: String(movie.id),
        document: {
          // Add all translated movie titles
          title: movie.title,
          originalTitle: movie.originalTitle,
          translation: movieTranslations.reduce(
            (acc: Record<string, string | undefined>, movieTranslation) => {
              const key =
                `${movieTranslation.iso6391}-${movieTranslation.iso31661}` as string;
              acc[key] = movieTranslation.title;
              return acc;
            },
            {},
          ),
        },
      });

      // sync graph
      this.eventManagerService.enqueueEvent(new ComparableUpdatedEvent(movie));

      return movie;
    } catch (error) {
      // TODO: add sync error log table
      console.log('error tmdb id: ', tmdbId);
      console.error(error);
    }
  }

  async syncMovieGenresByLanguage(iso6391: ISO6391) {
    // TODO: Add sync failure handling
    const tmdbMovieGenreDataList =
      await this.tmdbClientService.getAllMovieGenres(iso6391);

    if (iso6391 === 'en') {
      await Promise.all(
        tmdbMovieGenreDataList.map((tmdbMovieGenreData) => {
          return this.movieGenreRepository.upsert(tmdbMovieGenreData);
        }),
      );
    }

    await this.movieGenreTranslationRepository.upsertManyByIso6391(
      iso6391,
      tmdbMovieGenreDataList.map((tmdbMovieGenreData) => ({
        name: tmdbMovieGenreData.name,
        tmdbId: tmdbMovieGenreData.tmdbId,
      })),
    );
  }
}
