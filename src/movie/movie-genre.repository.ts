import { EntityRepository } from '@mikro-orm/mysql';
import { MovieGenre } from './entities/movie-genre.entity';
import { UpsertWithRequired } from 'src/common/types/entity.types';

export class MovieGenreRepository extends EntityRepository<MovieGenre> {
  async findByTmdbIds(tmdbIds: number[]): Promise<MovieGenre[]> {
    return await this.find({ tmdbId: { $in: tmdbIds } });
  }

  /**
   * Upsert movie genre by composite primary key, tmdbId.
   */
  async upsertManyByTmdbId(
    movieGenreUpsertDataList: UpsertWithRequired<
      MovieGenre,
      'tmdbId' | 'name'
    >[],
  ) {
    await Promise.all(
      movieGenreUpsertDataList.map(async (movieGenreUpsertData) => {
        const existingMovieGenre = await this.findOne({
          tmdbId: movieGenreUpsertData.tmdbId,
        });
        if (existingMovieGenre) {
          existingMovieGenre.name = movieGenreUpsertData.name;
        } else {
          const movieGenre = new MovieGenre(movieGenreUpsertData);
          this.getEntityManager().persist(movieGenre);
        }
      }),
    );
  }
}
