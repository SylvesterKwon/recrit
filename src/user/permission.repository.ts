import { EntityRepository } from '@mikro-orm/mysql';
import { Permission } from './entities/permission.entity';

export class PermissionRepository extends EntityRepository<Permission> {}
