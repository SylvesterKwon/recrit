import { Module } from '@nestjs/common';
import { MovieSyncService } from './movie-sync.service';
import { TmdbClientModule } from 'src/tmdb-client/tmdb-client.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieSyncApplication } from './movie-sync.application';
import { Movie } from './entities/movie.entity';
import { GraphModule } from 'src/graph/graph.module';

@Module({
  imports: [
    TmdbClientModule,
    MikroOrmModule.forFeature({ entities: [Movie, MovieGenre] }),
    GraphModule,
  ],
  controllers: [],
  providers: [MovieSyncApplication, MovieSyncService],
})
export class MovieModule {}
