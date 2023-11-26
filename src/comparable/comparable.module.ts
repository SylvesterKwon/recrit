import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Movie } from 'src/movie/entities/movie.entity';
import { ComparableProxyService } from './comparable-proxy.service';
import { ComparableController } from './comparable.controller';
import { ComparableApplication } from './comparable.application';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Movie] }), MovieModule],
  providers: [ComparableProxyService, ComparableApplication],
  controllers: [ComparableController],
  exports: [ComparableProxyService],
})
export class ComparableModule {}
