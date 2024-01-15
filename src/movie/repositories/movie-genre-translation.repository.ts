import { EntityRepository } from '@mikro-orm/postgresql';
import { MovieGenreTranslation } from '../entities/movie-genre-translation.entity';
import { MovieGenre } from '../entities/movie-genre.entity';
import { ISO6391 } from 'src/common/types/iso.types';

export class MovieGenreTranslationRepository extends EntityRepository<MovieGenreTranslation> {
  async upsertManyByIso6391(
    iso6391: ISO6391,
    movieGenreTranslationDataList: {
      name: string;
      tmdbId: number;
    }[],
  ) {
    const movieGenreRepository = this.em.getRepository(MovieGenre);
    const movieGenres = await movieGenreRepository.findAll();

    const newMovieGenreTranslations = await Promise.all(
      movieGenreTranslationDataList.map(async (movieGenreTranslationData) => {
        const movieGenre = movieGenres.find(
          (movieGenre) =>
            movieGenre.tmdbId === movieGenreTranslationData.tmdbId,
        );
        if (!movieGenre) {
          throw new Error(
            'Movie genre not found while upserting movie genre translation',
          );
        }

        const existingTranslations = await movieGenre.translations.matching({
          where: {
            iso6391,
          },
        });
        if (existingTranslations.length) {
          this.assign(existingTranslations[0], {
            name: 'ASFD',
          });
          return this.assign(existingTranslations[0], {
            name: movieGenreTranslationData.name,
          });
        } else {
          return this.create({
            movieGenre,
            iso6391,
            name: movieGenreTranslationData.name,
          });
        }
      }),
    );

    return newMovieGenreTranslations;
  }
}
