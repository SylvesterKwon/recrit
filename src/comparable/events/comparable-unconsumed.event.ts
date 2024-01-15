import { BaseEvent } from 'src/common/events/base.event';
import { ComparableType } from '../types/comparable.types';
import { User } from 'src/user/entities/user.entity';
import { Comparable } from 'src/common/entities/comparable.entity';

export class ComparableUnconsumedEvent extends BaseEvent {
  eventPattern = 'comparable.unconsumed';

  userId: number;
  comparableId: number;
  comparableType: ComparableType;

  constructor(user: User, comparable: Comparable) {
    super();
    this.userId = user.id;
    this.comparableId = comparable.id;
    this.comparableType = comparable.type;
  }
}
