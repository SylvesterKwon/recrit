import { Module } from '@nestjs/common';
import { MovieSyncService } from './services/movie-sync.service';
import { TmdbModule } from 'src/tmdb/tmdb.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieSyncApplication } from './movie-sync.application';
import { Movie } from './entities/movie.entity';
import { GraphModule } from 'src/graph/graph.module';
import { MovieService } from './services/movie.service';
import { MovieTranslation } from './entities/movie-translation.entity';
import { MovieGenreTranslation } from './entities/movie-genre-translation.entity';
import { MovieApplication } from './movie.application';

@Module({
  imports: [
    TmdbModule,
    MikroOrmModule.forFeature({
      entities: [Movie, MovieGenre, MovieTranslation, MovieGenreTranslation],
    }),
    GraphModule,
  ],
  controllers: [],
  providers: [
    MovieApplication,
    MovieSyncApplication,
    MovieSyncService,
    MovieService,
  ],
  exports: [MovieApplication, MovieService],
})
export class MovieModule {}
