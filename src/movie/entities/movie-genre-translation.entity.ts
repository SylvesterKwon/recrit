import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { ISO6391 } from 'src/common/types/iso.types';
import { MovieGenreTranslationRepository } from '../repositories/movie-genre-translation.repository';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { MovieGenre } from './movie-genre.entity';

@Entity({ repository: () => MovieGenreTranslationRepository })
export class MovieGenreTranslation extends TimestampedEntity {
  @ManyToOne()
  movieGenre: Ref<MovieGenre>;

  @Property()
  iso6391: ISO6391;

  // @Property()
  // iso31661: ISO31661;

  @Property()
  name: string;
}
