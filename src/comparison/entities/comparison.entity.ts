import { Entity, Enum, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { User } from 'src/user/entities/user.entity';
import { ComparisonRepository } from '../repositories/comparison.repository';

@Entity({ customRepository: () => ComparisonRepository })
export class Comparison extends TimestampedEntity {
  @Enum(() => ComparableType)
  comparableType: ComparableType;

  @Property()
  firstItemId: number;

  @Property()
  secondItemId: number;

  @Enum(() => Verdict)
  verdict: Verdict;

  @ManyToOne({ ref: true })
  user: Ref<User>;
}

export enum ComparableType {
  MOVIE = 'movie',
}

export enum Verdict {
  FIRST = 'first',
  SECOND = 'second',
  EQUAL = 'equal',
}
