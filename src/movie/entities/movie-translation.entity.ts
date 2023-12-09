import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Movie } from './movie.entity';
import { ISO31661, ISO6391 } from 'src/common/types/iso.types';
import { MovieTranslationRepository } from '../movie-translation.repository';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';

@Entity({ customRepository: () => MovieTranslationRepository })
export class MovieTranslation extends TimestampedEntity {
  @ManyToOne()
  movie: Movie;

  @Property()
  iso31661: ISO31661;

  @Property()
  iso6391: ISO6391;

  @Property()
  homepage?: string;

  @Property({ length: 1000 })
  overview?: string;

  @Property({ length: 500 })
  tagline?: string;

  @Property()
  title?: string;
}
