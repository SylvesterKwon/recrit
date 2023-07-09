import { IdEntity, TimestampedEntity } from '../entities/timestamped-entity';

export type ExcludeTimestampedEntity<T> = Omit<T, keyof TimestampedEntity>;

/**
 * Generic type of an object used to construct an entity.
 */
export type Create<T> = ExcludeTimestampedEntity<Local<T>>;

/**
 * Generic type of an object used to update an entity.
 */
export type Update<T> = Partial<ExcludeTimestampedEntity<Local<T>>> & IdEntity;

/**
 * Generic type of an object used to upsert an entity.
 */
export type Upsert<T> = Partial<ExcludeTimestampedEntity<Local<T>>> &
  Partial<IdEntity>;

/**
 * Generic type of an object used to upsert an entity with required props.
 */
export type UpsertWithRequired<T, K extends keyof Upsert<T>> = Upsert<T> &
  Required<Pick<Upsert<T>, K>>;

/**
 * Union type of local property (non-foreign key property) type.
 */
type LocalProp = string | number | boolean | null | undefined | Date;

/**
 * Union type of local property (non-foreign key property) property name.
 */
type LocalPropNames<T> = {
  [K in keyof T]: T[K] extends LocalProp ? K : never;
}[keyof T];

/**
 * Generic type of an object with only local properties (non-foreign key property).
 */
export type Local<T> = Pick<T, LocalPropNames<T>>;
