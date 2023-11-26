import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { PermissionRepository } from '../repositories/permission.repository';
import { Role } from './role.entity';

@Entity({ customRepository: () => PermissionRepository })
export class Permission extends TimestampedEntity {
  @Property()
  @Unique()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToMany({ mappedBy: 'permissions' })
  roles = new Collection<Role>(this);
}
