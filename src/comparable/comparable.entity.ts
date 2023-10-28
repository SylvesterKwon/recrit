import { Entity } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { ComparableType } from './types/comparable.types';

@Entity({ abstract: true })
export abstract class Comparable extends TimestampedEntity {
  /**
   * Returns the type of the comparable. Must be implemented in child comparable class
   */
  abstract get type(): ComparableType;
}
