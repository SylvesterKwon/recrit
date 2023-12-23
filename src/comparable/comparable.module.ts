import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Movie } from 'src/movie/entities/movie.entity';
import { ComparableProxyService } from './services/comparable-proxy.service';
import { ComparableController } from './comparable.controller';
import { ComparableApplication } from './comparable.application';
import { MovieModule } from 'src/movie/movie.module';
import { User } from 'src/user/entities/user.entity';
import { GraphModule } from 'src/graph/graph.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, Movie] }),
    MovieModule,
    GraphModule,
  ],
  providers: [ComparableProxyService, ComparableApplication],
  controllers: [ComparableController],
  exports: [ComparableProxyService],
})
export class ComparableModule {}
