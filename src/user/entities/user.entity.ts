import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Role } from './role.entity';
import { UserRepository } from '../repositories/user.repository';
import { Movie } from 'src/movie/entities/movie.entity';

@Entity({ customRepository: () => UserRepository })
export class User extends TimestampedEntity {
  @Property()
  @Unique()
  username: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  hashedPassword: string;

  @ManyToOne()
  role?: Ref<Role>;

  // Movie
  @ManyToMany()
  consumedMovies = new Collection<Movie>(this);

  @ManyToMany()
  toConsumeMovieList = new Collection<Movie>(this);
}
