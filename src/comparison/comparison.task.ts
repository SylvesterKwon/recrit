import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { BaseTask } from 'src/common/applications/base.applicaiton';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { ComparisonCreatedEvent } from './events/comparison-created.event';
import { ComparisonRepository } from './repositories/comparison.repository';
import { ComparisonNotFoundException } from 'src/common/exceptions/comparison.exception';

@Injectable()
export class ComparisonTask extends BaseTask {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private graphRepository: GraphRepository,
    private comparisonRepository: ComparisonRepository,
    private userRepository: UserRepository,
  ) {
    super();
  }

  @Transactional()
  async handleComparisonCreatedEvent(event: ComparisonCreatedEvent) {
    const comparison = await this.comparisonRepository.findOne({
      id: event.comparisonId,
    });
    if (!comparison) throw new ComparisonNotFoundException();
    const user = await this.userRepository.findById(comparison.user.id);
    if (!user) throw new UserNotFoundException();

    await this.graphRepository.upsertComparison(comparison);
  }
}
