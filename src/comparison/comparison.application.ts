import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ComparisonService } from './services/comparison.service';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { UserRepository } from 'src/user/repositories/user.repository';
import { ComparisonVerdict } from './entities/comparison.entity';
import { ComparableProxyService } from 'src/comparable/services/comparable-proxy.service';
import { ComparableType } from 'src/comparable/types/comparable.types';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { ComparableNotFoundException } from 'src/common/exceptions/comparable.exception';
import { BaseApplication } from 'src/common/applications/base.applicaiton';
import { EventManagerService } from 'src/event-manager/event-manager.service';

@Injectable()
export class ComparisonApplication extends BaseApplication {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private comparisonService: ComparisonService,
    private comparableProxyService: ComparableProxyService,
    private userRepository: UserRepository,
  ) {
    super();
  }

  @Transactional()
  async createComparison(
    userId: number,
    comparableType: ComparableType,
    firstItemId: number,
    secondItemId: number,
    verdict: ComparisonVerdict,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const firstItem = await this.comparableProxyService.getComparable(
      comparableType,
      firstItemId,
    );
    const secondItem = await this.comparableProxyService.getComparable(
      comparableType,
      secondItemId,
    );
    if (!firstItem || !secondItem) throw new ComparableNotFoundException();

    return await this.comparisonService.createComparison(
      user,
      firstItem,
      secondItem,
      verdict,
    );
  }
}
