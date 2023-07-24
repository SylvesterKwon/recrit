import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import dayjs from 'dayjs';

@Entity({ abstract: true })
export class IdEntity {
  @PrimaryKey()
  id: number;
}

@Entity({ abstract: true })
export class TimestampedEntity extends IdEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ onCreate: () => dayjs().utc().toDate() })
  createdAt: Date;

  @Property({
    onCreate: () => dayjs().utc().toDate(),
    onUpdate: () => dayjs().utc().toDate(),
  })
  updatedAt: Date;
}
