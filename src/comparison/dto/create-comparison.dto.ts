import { ComparableType } from 'src/comparable/types/comparable.types';
import { ComparisonVerdict } from '../entities/comparison.entity';

export class CreateComparisonDto {
  comparableType: ComparableType;
  firstItemId: number;
  secondItemId: number;
  verdict: ComparisonVerdict;
}
