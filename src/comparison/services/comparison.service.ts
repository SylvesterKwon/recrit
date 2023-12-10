import { Injectable } from '@nestjs/common';
import { ComparisonRepository } from '../repositories/comparison.repository';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { ComparisonVerdict } from '../entities/comparison.entity';
import { User } from 'src/user/entities/user.entity';
import { Comparable } from 'src/common/entities/comparable.entity';
import { SameComparisonExistsException } from 'src/common/exceptions/comparison.exception';

@Injectable()
export class ComparisonService {
  constructor(
    private comparisonRepository: ComparisonRepository,
    private graphRepository: GraphRepository,
  ) {}

  async createComparison(
    user: User,
    firstItem: Comparable,
    secondItem: Comparable,
    verdict: ComparisonVerdict,
  ) {
    if (firstItem.id === secondItem.id)
      throw new Error('Cannot compare item to itself');
    if (firstItem.type !== secondItem.type)
      throw new Error('Cannot compare items of different types');

    const reorderedComparison = this.sortItemOrder(
      firstItem,
      secondItem,
      verdict,
    );
    const comparableType = firstItem.type;

    const existingLatestComparison = await this.comparisonRepository.findLatest(
      user,
      comparableType,
      reorderedComparison.firstItem.id,
      reorderedComparison.secondItem.id,
    );
    if (
      existingLatestComparison &&
      existingLatestComparison.verdict === verdict
    )
      throw new SameComparisonExistsException();

    const comparison = this.comparisonRepository.create({
      user: user,
      firstItemId: reorderedComparison.firstItem.id,
      secondItemId: reorderedComparison.secondItem.id,
      comparableType: comparableType,
      verdict: reorderedComparison.verdict,
    });

    await this.graphRepository.upsertComparison(comparison);
    return comparison;
  }

  /**
   * Swap the order of two items if the first item's id is greater than the second item's id.
   */
  private sortItemOrder(
    firstItem: Comparable,
    secondItem: Comparable,
    verdict: ComparisonVerdict,
  ) {
    if (firstItem.id > secondItem.id) {
      return {
        firstItem: secondItem,
        secondItem: firstItem,
        verdict:
          verdict === ComparisonVerdict.FIRST
            ? ComparisonVerdict.SECOND
            : ComparisonVerdict.FIRST,
      };
    } else
      return {
        firstItem: firstItem,
        secondItem: secondItem,
        verdict: verdict,
      };
  }
}
