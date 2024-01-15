import { BaseEvent } from 'src/common/events/base.event';
import { ComparableType } from '../types/comparable.types';
import { User } from 'src/user/entities/user.entity';
import { Comparable } from 'src/common/entities/comparable.entity';

export class ComparableConsumedEvent extends BaseEvent {
  eventPattern = 'comparable.consumed';

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
