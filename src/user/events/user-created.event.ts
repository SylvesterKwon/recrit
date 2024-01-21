import { BaseEvent } from 'src/common/events/base.event';
import { User } from 'src/user/entities/user.entity';

export class UserCreatedEvent extends BaseEvent {
  eventPattern = 'user.created';

  userId: number;
  comparableId: number;

  constructor(user: User) {
    super();
    this.userId = user.id;
  }
}
