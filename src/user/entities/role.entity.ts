import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { RoleRepository } from '../role.repository';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ customRepository: () => RoleRepository })
export class Role extends TimestampedEntity {
  @Property()
  @Unique()
  name: string;

  @Property()
  description: string;

  @ManyToMany({ inversedBy: 'roles' })
  permissions = new Collection<Permission>(this);

  @OneToMany({ mappedBy: 'role' })
  users = new Collection<User>(this);
}
