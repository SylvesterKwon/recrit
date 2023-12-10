import { EntityRepository } from '@mikro-orm/postgresql';
import { MovieTranslation } from './entities/movie-translation.entity';
import { RequiredEntityData } from '@mikro-orm/core';
import { Movie } from './entities/movie.entity';

export class MovieTranslationRepository extends EntityRepository<MovieTranslation> {
  async upsertManyByMovieAndIsoCodes(
    movie: Movie,
    movieTranslationDataList: Omit<
      RequiredEntityData<MovieTranslation>,
      'movie'
    >[],
  ) {
    await movie.translations.init();
    const existingMovieTranslations = movie.translations.getItems();

    const newMovieTranslations = movieTranslationDataList.map(
      (movieTranslationData) => {
        const existingMovieTranslation = existingMovieTranslations.find(
          (existingMovieTranslation) =>
            existingMovieTranslation.iso31661 ===
              movieTranslationData.iso31661 &&
            existingMovieTranslation.iso6391 === movieTranslationData.iso6391,
        );
        if (existingMovieTranslation) {
          return this.assign(existingMovieTranslation, movieTranslationData);
        } else {
          return this.create({
            movie,
            ...movieTranslationData,
          });
        }
      },
    );

    movie.translations.set(newMovieTranslations);
  }
}
