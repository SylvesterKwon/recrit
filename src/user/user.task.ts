import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { BaseTask } from 'src/common/applications/base.applicaiton';
import { Transactional } from 'src/common/decorators/transactional.decorator';

@Injectable()
export class UserTask extends BaseTask {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private graphRepository: GraphRepository,
    private userRepository: UserRepository,
  ) {
    super();
  }

  @Transactional()
  async handleUserCreated(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    this.graphRepository.createUserNode(user);
  }
}
