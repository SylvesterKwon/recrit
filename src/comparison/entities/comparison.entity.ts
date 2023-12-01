import { Entity, Enum, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { ComparisonRepository } from '../comparison.repository';
import { User } from 'src/user/entities/user.entity';
import { ComparableType } from 'src/comparable/types/comparable.types';

@Entity({ customRepository: () => ComparisonRepository })
export class Comparison extends TimestampedEntity {
  @Enum(() => ComparableType)
  comparableType: ComparableType;

  @Property()
  firstItemId: number;

  @Property()
  secondItemId: number;

  @Enum(() => ComparisonVerdict)
  verdict: ComparisonVerdict;

  @ManyToOne()
  user: Ref<User>;

  @Property({ length: 1024 })
  comment?: string;
}

export enum ComparisonVerdict {
  FIRST = 'first',
  SECOND = 'second',
  EQUAL = 'equal',
}
