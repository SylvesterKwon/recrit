import { EntityRepository } from '@mikro-orm/postgresql';
import { Comparison } from '../entities/comparison.entity';
import { ComparableType } from 'src/comparable/types/comparable.types';
import { User } from 'src/user/entities/user.entity';

export class ComparisonRepository extends EntityRepository<Comparison> {
  /**
   * Find user's latest comparison between two items of the same type.
   */
  async findLatest(
    user: User,
    comparableType: ComparableType,
    firstItemId: number,
    secondItemId: number,
  ) {
    return await this.findOne(
      {
        user,
        comparableType,
        firstItemId,
        secondItemId,
      },
      {
        orderBy: { createdAt: 'desc' },
      },
    );
  }
}
