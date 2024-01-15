import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { ComparableType } from './types/comparable.types';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { BaseTask } from 'src/common/applications/base.applicaiton';
import { Transactional } from 'src/common/decorators/transactional.decorator';

@Injectable()
export class ComparableTask extends BaseTask {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private graphRepository: GraphRepository,
    private userRepository: UserRepository,
  ) {
    super();
  }

  // TODO: @Task 데코레이터 생성후 task 재시도 등 여러 정책 설정할 수 있도록 하기

  @Transactional()
  async addConsumeInGraph(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    await this.graphRepository.upsertConsume(
      user,
      comparableType,
      comparableId,
    );
  }

  @Transactional()
  async removeConsumeInGraph(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    await this.graphRepository.deleteConsume(
      user,
      comparableType,
      comparableId,
    );
  }
}
