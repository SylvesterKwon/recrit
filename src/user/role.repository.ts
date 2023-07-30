import { EntityRepository } from '@mikro-orm/mysql';
import { Role } from './entities/role.entity';

export class RoleRepository extends EntityRepository<Role> {}
