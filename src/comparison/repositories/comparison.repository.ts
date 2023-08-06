import { EntityRepository } from '@mikro-orm/mysql';
import { Comparison } from 'src/comparison/entities/comparison.entity';

export class ComparisonRepository extends EntityRepository<Comparison> {}
