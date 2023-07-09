import { EntityRepository } from '@mikro-orm/mysql';
import { Movie } from './entities/movie.entity';
import { UpsertWithRequired } from 'src/common/types/entity.types';
import { MovieRelations } from './types/movie.types';

export class MovieRepository extends EntityRepository<Movie> {
  async findOneById(id: number): Promise<Movie | null> {
    return await this.findOne({ id });
  }

  async findOneByTmdbId(tmdbId: number): Promise<Movie | null> {
    return await this.findOne({ tmdbId });
  }

  /**
   * Upsert movie by tmdbId.
   */
  async upsertByTmdbId(
    movieUpsertPropsWithRelation: UpsertWithRequired<Movie, 'tmdbId'> &
      MovieRelations,
  ) {
    const existingMovie = await this.findOneByTmdbId(
      movieUpsertPropsWithRelation.tmdbId,
    );
    if (existingMovie) {
      existingMovie.adult = movieUpsertPropsWithRelation.adult;
      existingMovie.backdropPath = movieUpsertPropsWithRelation.backdropPath;
      existingMovie.budget = movieUpsertPropsWithRelation.budget;
      existingMovie.homepage = movieUpsertPropsWithRelation.homepage;
      existingMovie.imdbId = movieUpsertPropsWithRelation.imdbId;
      existingMovie.originalLanguage =
        movieUpsertPropsWithRelation.originalLanguage;
      existingMovie.originalTitle = movieUpsertPropsWithRelation.originalTitle;
      existingMovie.overview = movieUpsertPropsWithRelation.overview;
      existingMovie.posterPath = movieUpsertPropsWithRelation.posterPath;
      existingMovie.releaseDate = movieUpsertPropsWithRelation.releaseDate;
      existingMovie.revenue = movieUpsertPropsWithRelation.revenue;
      existingMovie.runtime = movieUpsertPropsWithRelation.runtime;
      existingMovie.status = movieUpsertPropsWithRelation.status;
      existingMovie.tagline = movieUpsertPropsWithRelation.tagline;
      existingMovie.title = movieUpsertPropsWithRelation.title;
      existingMovie.video = movieUpsertPropsWithRelation.video;

      this.getEntityManager().persist(existingMovie);
      return existingMovie;
    } else {
      const movie = new Movie({
        tmdbId: movieUpsertPropsWithRelation.tmdbId,
        adult: movieUpsertPropsWithRelation.adult,
        backdropPath: movieUpsertPropsWithRelation.backdropPath,
        budget: movieUpsertPropsWithRelation.budget,
        homepage: movieUpsertPropsWithRelation.homepage,
        imdbId: movieUpsertPropsWithRelation.imdbId,
        originalLanguage: movieUpsertPropsWithRelation.originalLanguage,
        originalTitle: movieUpsertPropsWithRelation.originalTitle,
        overview: movieUpsertPropsWithRelation.overview,
        posterPath: movieUpsertPropsWithRelation.posterPath,
        releaseDate: movieUpsertPropsWithRelation.releaseDate,
        revenue: movieUpsertPropsWithRelation.revenue,
        runtime: movieUpsertPropsWithRelation.runtime,
        status: movieUpsertPropsWithRelation.status,
        tagline: movieUpsertPropsWithRelation.tagline,
        title: movieUpsertPropsWithRelation.title,
        video: movieUpsertPropsWithRelation.video,
      });
      this.getEntityManager().persist(movie);
      return movie;
    }
  }
}
