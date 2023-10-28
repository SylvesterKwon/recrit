import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GraphModule } from 'src/graph/graph.module';
import { ComparisonService } from './comparison.service';
import { ComparisonApplication } from './comparison.application';
import { Comparison } from './entities/comparison.entity';
import { ComparableModule } from 'src/comparable/comparable.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Comparison, User] }),
    GraphModule,
    ComparableModule,
  ],
  controllers: [],
  providers: [ComparisonApplication, ComparisonService],
})
export class ComparisonModule {}
