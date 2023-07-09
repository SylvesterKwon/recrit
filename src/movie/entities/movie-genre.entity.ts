import { Entity, Property, Unique } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { MovieGenreRepository } from '../movie-genre.repository';
import { Create } from 'src/common/types/entity.types';

@Entity({ customRepository: () => MovieGenreRepository })
export class MovieGenre extends TimestampedEntity {
  @Property()
  @Unique()
  tmdbId: number;

  // TODO: 다국어 지원 schema 사용시 deprecate
  @Property()
  name: string;

  constructor(props: Create<MovieGenre>) {
    super();
    this.tmdbId = props.tmdbId;
    this.name = props.name;
  }
}
