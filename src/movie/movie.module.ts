import { Module } from '@nestjs/common';
import { MovieSyncService } from './movie-sync.service';
import { TmdbClientModule } from 'src/tmdb-client/tmdb-client.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieSyncApplication } from './movie-sync.application';
import { Movie } from './entities/movie.entity';
import { GraphModule } from 'src/graph/graph.module';
import { MovieService } from './movie.service';

@Module({
  imports: [
    TmdbClientModule,
    MikroOrmModule.forFeature({ entities: [Movie, MovieGenre] }),
    GraphModule,
  ],
  controllers: [],
  providers: [MovieService, MovieSyncApplication, MovieSyncService],
  exports: [MovieService],
})
export class MovieModule {}
