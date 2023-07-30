import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { UserRepository } from '../user.repository';
import { Role } from './role.entity';

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

  @ManyToOne({ nullable: true })
  role?: Role;
}
