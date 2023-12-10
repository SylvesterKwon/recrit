import { Module } from '@nestjs/common';
import { GraphConstraintService } from './services/graph-constraint.service';
import { GraphRepository } from './repositories/graph.repository';

@Module({
  imports: [],
  providers: [GraphConstraintService, GraphRepository],
  exports: [GraphRepository],
})
export class GraphModule {}
