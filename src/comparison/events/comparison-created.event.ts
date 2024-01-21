import { BaseEvent } from 'src/common/events/base.event';
import { Comparison } from '../entities/comparison.entity';

export class ComparisonCreatedEvent extends BaseEvent {
  eventPattern = 'comparison.created';
  comparisonId: number;

  constructor(comparison: Comparison) {
    super();
    this.comparisonId = comparison.id;
  }
}
