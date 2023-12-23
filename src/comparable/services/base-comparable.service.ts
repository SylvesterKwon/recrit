import { User } from 'src/user/entities/user.entity';
import { Comparable } from '../../common/entities/comparable.entity';
import { LanguageISOCodes } from '../../common/types/iso.types';
import {
  Collection,
  EntityName,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/core';
import {
  ComparableAlreadyConsumedException,
  ComparableAlreadyInToConsumeListException,
  ComparableNotConsumedException,
  ComparableNotInToConsumeListException,
} from '../../common/exceptions/comparable.exception';
import { GraphRepository } from 'src/graph/repositories/graph.repository';
import { ConsumptionStatus } from '../types/comparable.types';

/**
 * Base comparable service. All comparable services must extend this class
 */
export abstract class BaseComparableService<T extends Comparable> {
  protected abstract orm: MikroORM;

  protected abstract graphRepository: GraphRepository;

  /**
   * Comparable entity
   */
  abstract get comparableEntity(): EntityName<T>;

  /**
   * Comparable repository
   */
  get comparableRepository() {
    // Used type assertion because EntityRepository<T> is not working properly
    // TODO: fix this to use EntityRepository<T>
    return this.orm.em.getRepository(
      this.comparableEntity,
    ) as unknown as EntityRepository<Comparable>;
  }

  /**
   * Returns the user's consumed comparables collection
   */
  abstract getUserConsumedComparables(user: User): Collection<T>;

  /**
   * Returns the user's to-consume-comparable-list collection
   */
  abstract getUserToConsumeComparableList(user: User): Collection<T>;

  /**
   * Mark comparable as consumed by user
   */
  async consume(user: User, comparable: T): Promise<void> {
    const userConsumedComparables = this.getUserConsumedComparables(user);
    await userConsumedComparables.init();

    const alreadyConsumed = userConsumedComparables.contains(comparable);
    if (alreadyConsumed) throw new ComparableAlreadyConsumedException();

    userConsumedComparables.add(comparable);

    try {
      await this.removeToConsumeList(user, comparable);
    } catch (error) {
      if (error instanceof ComparableNotInToConsumeListException) {
        // do nothing
      } else {
        throw error;
      }
    }

    await this.graphRepository.upsertConsume(
      user,
      comparable.type,
      comparable.id,
    );
  }

  /**
   * Unmark comparable as consumed by user
   */
  async unconsume(user: User, comparable: T): Promise<void> {
    const userConsumedComparables = this.getUserConsumedComparables(user);
    await userConsumedComparables.init();

    const notConsumed = !userConsumedComparables.contains(comparable);
    if (notConsumed) throw new ComparableNotConsumedException();

    userConsumedComparables.remove(comparable);

    await this.graphRepository.deleteConsume(
      user,
      comparable.type,
      comparable.id,
    );
  }

  /**
   * Add comparable to to-consume-list
   */
  async addToConsumeList(user: User, comparable: T): Promise<void> {
    const userToConsumeComparableList =
      this.getUserToConsumeComparableList(user);
    await userToConsumeComparableList.init();

    const alreadyAdded = userToConsumeComparableList.contains(comparable);
    if (alreadyAdded) throw new ComparableAlreadyInToConsumeListException();

    userToConsumeComparableList.add(comparable);
  }

  /**
   * Remove comparable from to-consume-list
   */
  async removeToConsumeList(user: User, comparable: T): Promise<void> {
    const userToConsumeComparableList =
      this.getUserToConsumeComparableList(user);
    await userToConsumeComparableList.init();

    const notAdded = !userToConsumeComparableList.contains(comparable);
    if (notAdded) throw new ComparableNotInToConsumeListException();

    userToConsumeComparableList.remove(comparable);
  }

  async getConsumptionStatuses(
    user: User,
    comparableIds: number[],
  ): Promise<ConsumptionStatus[]> {
    // if needed, add non-existing comparable handling

    const consumedComparables = await this.comparableRepository.find({
      id: { $in: comparableIds },
      consumedUsers: user,
    });
    const toConsumeListedComparables = await this.comparableRepository.find({
      id: { $in: comparableIds },
      toConsumeListedUsers: user,
    });

    return comparableIds.map((comparableId) => ({
      id: comparableId,
      consumed: Boolean(
        consumedComparables.find(
          (comparable) => comparable.id === comparableId,
        ),
      ),
      toConsumeListed: Boolean(
        toConsumeListedComparables.find(
          (comparable) => comparable.id === comparableId,
        ),
      ),
    }));
  }

  /**
   * Get comparable's information for web application
   */
  abstract getInformation(
    comparable: Comparable,
    languageIsoCodes?: LanguageISOCodes,
  ): Promise<any>;
}
