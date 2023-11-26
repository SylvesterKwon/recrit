import { Injectable } from '@nestjs/common';
import { BaseComparableService } from 'src/common/services/base-comparable.service';
import { Movie } from './entities/movie.entity';
import { MovieInformation } from './types/movie.types';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MovieService extends BaseComparableService {
  constructor(private movieRepository: MovieRepository) {
    super();
  }

  get relatedEntity() {
    return Movie;
  }

  async getInformation(movie: Movie): Promise<MovieInformation> {
    return movie; // TOOD: implement this to return movie information that is subset of Movie
  }
}
