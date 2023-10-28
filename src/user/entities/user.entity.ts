import { Entity, ManyToOne, Property, Ref, Unique } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { Role } from './role.entity';
import { UserRepository } from '../repositories/user.repository';

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
  role?: Ref<Role>;
}
