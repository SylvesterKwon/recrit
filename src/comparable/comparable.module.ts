import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Movie } from 'src/movie/entities/movie.entity';
import { ComparableService } from './comparable.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Movie] })],
  providers: [ComparableService],
  exports: [ComparableService],
})
export class ComparableModule {}
