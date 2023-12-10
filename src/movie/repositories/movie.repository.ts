import { EntityRepository } from '@mikro-orm/postgresql';
import { Movie } from '../entities/movie.entity';

export class MovieRepository extends EntityRepository<Movie> {}
