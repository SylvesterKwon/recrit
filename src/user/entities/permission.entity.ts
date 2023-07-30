import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity';
import { PermissionRepository } from '../permission.repository';
import { Role } from './role.entity';

@Entity({ customRepository: () => PermissionRepository })
export class Permission extends TimestampedEntity {
  @Property()
  @Unique()
  name: string;

  @Property()
  description: string;

  @ManyToMany({ mappedBy: 'permissions' })
  roles = new Collection<Role>(this);
}
