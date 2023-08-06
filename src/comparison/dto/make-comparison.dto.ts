import { Verdict } from '../entities/comparison.entity';

export class MakeComparisonDto {
  firstItemId: number;
  secondItemId: number;
  verdict: Verdict;
}
