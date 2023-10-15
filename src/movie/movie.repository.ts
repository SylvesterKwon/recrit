import { EntityRepository } from '@mikro-orm/mysql';
import { Movie } from './entities/movie.entity';

export class MovieRepository extends EntityRepository<Movie> {}
