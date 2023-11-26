import { Injectable } from '@nestjs/common';
import { MovieSyncService } from './movie-sync.service';
import { MikroORM } from '@mikro-orm/core';
import { ISO6391 } from 'src/common/types/iso.types';
import { Transactional } from 'src/common/decorators/transactional.decorator';
// import { delay } from 'src/common/utils/delay';

@Injectable()
export class MovieSyncApplication {
  constructor(
    private orm: MikroORM,
    private movieSyncService: MovieSyncService,
  ) {
    // TODO: 테스트용 임시 코드, 삭제 필요
    // this.syncMovieGenres();
    // delay(1000);
    this.syncAllMovies();
  }

  /**
   * Sync one movie by tmdbId from TMDB database.
   */
  @Transactional()
  async syncMovie(tmdbId: number) {
    await this.movieSyncService.syncMovieByTmdbId(tmdbId);
  }

  /**
   * Sync all movies from TMDB database.
   */
  @Transactional()
  async syncAllMovies() {
    await this.movieSyncService.syncAllMovies();
    await this.orm.em.flush();
  }

  /**
   * Sync all movie genres from TMDB database by language in ISO 639-1 format.
   */
  @Transactional()
  async syncMovieGenresByLanguage(language: ISO6391) {
    await this.movieSyncService.syncMovieGenresByLanguage(language);
  }

  /**
   * Sync all movie genres from TMDB database in all language.
   */
  @Transactional()
  async syncMovieGenres() {
    await Promise.all([this.movieSyncService.syncMovieGenresByLanguage('en')]);
  }
}
