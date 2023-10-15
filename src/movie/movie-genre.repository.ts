import { EntityRepository } from '@mikro-orm/mysql';
import { MovieGenre } from './entities/movie-genre.entity';

export class MovieGenreRepository extends EntityRepository<MovieGenre> {
  async findByTmdbIds(tmdbIds: number[]): Promise<MovieGenre[]> {
    return await this.find({ tmdbId: { $in: tmdbIds } });
  }
}
