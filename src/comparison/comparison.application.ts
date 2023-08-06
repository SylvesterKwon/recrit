import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ComparableType, Verdict } from './entities/comparison.entity';
import { ComparisonService } from './comparison.service';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class ComparisonApplication {
  constructor(
    private orm: MikroORM,
    private comparisonService: ComparisonService,
  ) {}

  async makeComparison(
    user: User,
    comparableType: ComparableType,
    firstItemId: number,
    secondItemId: number,
    verdict: Verdict,
  ) {
    return await this.orm.em.transactional(async () => {
      return await this.comparisonService.makeComparison(
        user,
        comparableType,
        firstItemId,
        secondItemId,
        verdict,
      );
    });
  }
}
