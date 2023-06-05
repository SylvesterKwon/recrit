import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import dayjs from 'dayjs';

@Entity({ abstract: true })
export class TimestampedEntity {
  @Property()
  createdAt: string = dayjs().utc().format();

  @Property({ onUpdate: () => dayjs().utc().format() })
  updatedAt: string = dayjs().utc().format();
}

// TODO: Remove this entity
@Entity()
export class Tmp {
  @PrimaryKey()
  id: number;
}
