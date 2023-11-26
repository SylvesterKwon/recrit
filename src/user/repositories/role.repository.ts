import { EntityRepository } from '@mikro-orm/postgresql';
import { Role } from 'moviedb-promise';

export class RoleRepository extends EntityRepository<Role> {}
