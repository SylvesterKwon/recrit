import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ComparableType, Verdict } from './entities/comparison.entity';
import { ComparisonRepository } from './repositories/comparison.repository';

@Injectable()
export class ComparisonService {
  constructor(private comparisonRepository: ComparisonRepository) {}

  async makeComparison(
    user: User,
    comparableType: ComparableType,
    firstItemId: number,
    secondItemId: number,
    verdict: Verdict,
  ) {
    this.comparisonRepository.create({
      user,
      comparableType,
      firstItemId,
      secondItemId,
      verdict,
    });
  }
}
