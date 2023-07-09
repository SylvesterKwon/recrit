import { Module } from '@nestjs/common';
import { MovieSyncService } from './movie-sync.service';
import { TmdbClientModule } from 'src/tmdb-client/tmdb-client.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieGenre } from './entities/movie-genre.entity';
import { MovieSyncApplication } from './movie-sync.application';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [
    TmdbClientModule,
    MikroOrmModule.forFeature({ entities: [Movie, MovieGenre] }),
  ],
  controllers: [],
  providers: [MovieSyncApplication, MovieSyncService],
})
export class MovieModule {}
