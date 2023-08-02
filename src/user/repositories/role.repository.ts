import { EntityRepository } from '@mikro-orm/mysql';
import { Role } from 'moviedb-promise';

export class RoleRepository extends EntityRepository<Role> {}
