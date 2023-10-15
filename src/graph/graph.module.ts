import { Module } from '@nestjs/common';
import { GraphConstraintService } from './graph-constraint.service';
import { GraphRepository } from './graph.repository';

@Module({
  imports: [],
  providers: [GraphConstraintService, GraphRepository],
  exports: [GraphRepository],
})
export class GraphModule {}
