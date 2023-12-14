import { Collection, Entity } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { ComparableType } from '../../comparable/types/comparable.types';
import { User } from 'src/user/entities/user.entity';

@Entity({ abstract: true })
export abstract class Comparable extends TimestampedEntity {
  /**
   * Returns the type of the comparable. Must be implemented in child comparable class
   */
  abstract get type(): ComparableType;

  abstract consumedUsers: Collection<User>;
}
