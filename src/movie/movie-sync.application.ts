import { Injectable } from '@nestjs/common';
import { MovieSyncService } from './movie-sync.service';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { ISO6391 } from 'src/common/types/iso-639-1.types';
import { delay } from 'src/common/utils/delay';

@Injectable()
export class MovieSyncApplication {
  constructor(
    private readonly orm: MikroORM,
    private readonly movieSyncService: MovieSyncService,
  ) {
    // // TODO: 테스트용 임시 코드, 삭제 필요
    // this.syncMovieGenres();
    // delay(1000);
    // // this.syncMovie(2);
    // this.syncAllMovies();
  }

  /**
   * Sync one movie by tmdbId from TMDB database.
   */
  @UseRequestContext()
  async syncMovie(tmdbId: number) {
    await this.orm.em.transactional(async () => {
      await this.movieSyncService.syncMovieByTmdbId(tmdbId);
    });
  }

  /**
   * Sync all movies from TMDB database.
   */
  @UseRequestContext()
  async syncAllMovies() {
    await this.movieSyncService.syncAllMovies();
    await this.orm.em.flush();
  }

  /**
   * Sync all movie genres from TMDB database by language in ISO 639-1 format.
   */
  @UseRequestContext()
  async syncMovieGenresByLanguage(language: ISO6391) {
    await this.orm.em.transactional(async () => {
      await this.movieSyncService.syncMovieGenresByLanguage(language);
    });
  }

  /**
   * Sync all movie genres from TMDB database in all language.
   */
  @UseRequestContext()
  async syncMovieGenres() {
    await this.orm.em.transactional(async () => {
      await Promise.all([
        this.movieSyncService.syncMovieGenresByLanguage('en'),
      ]);
    });
  }
}
