import { Entity, Property, Unique } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { UserRepository } from '../user.repository';

@Entity({ customRepository: () => UserRepository })
export class User extends TimestampedEntity {
  @Property()
  @Unique()
  username: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  hashedPassword: string;
}
