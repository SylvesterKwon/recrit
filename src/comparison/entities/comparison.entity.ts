import { Entity, Enum, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { ComparisonRepository } from '../repositories/comparison.repository';
import { User } from 'src/user/entities/user.entity';
import { ComparableType } from 'src/comparable/types/comparable.types';

@Entity({ repository: () => ComparisonRepository })
export class Comparison extends TimestampedEntity {
  @Enum(() => ComparableType)
  comparableType: ComparableType;

  @Property()
  firstItemId: number;

  @Property()
  secondItemId: number;

  @Enum(() => ComparisonVerdict)
  verdict: ComparisonVerdict;

  // many to one 관계 사용할때 Ref 타입 사용하면서 ManyToOne 옵션에 entity 명시 하지 않으면 다음과 같은 에러 발생
  // Entity 'any' was not discovered, please make sure to provide it in 'entities' array when initializing the ORM (used in Comparison.user)
  // reference: https://github.com/mikro-orm/mikro-orm/issues/1633
  @ManyToOne({ entity: () => User })
  user: Ref<User>;

  @Property({ length: 1024 })
  comment?: string;
}

export enum ComparisonVerdict {
  FIRST = 'first',
  SECOND = 'second',
  EQUAL = 'equal',
}
