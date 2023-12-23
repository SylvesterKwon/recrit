import { User } from 'src/user/entities/user.entity';
import { Comparable } from '../entities/comparable.entity';
import { LanguageISOCodes } from '../types/iso.types';
import { Collection, EntityName } from '@mikro-orm/core';
import {
  ComparableAlreadyConsumedException,
  ComparableAlreadyInToConsumeListException,
  ComparableNotConsumedException,
  ComparableNotInToConsumeListException,
} from '../exceptions/comparable.exception';
import { GraphRepository } from 'src/graph/repositories/graph.repository';

/**
 * Base comparable service. All comparable services must extend this class
 */
export abstract class BaseComparableService<T extends Comparable> {
  protected abstract graphRepository: GraphRepository;

  /**
   * Get the comparable entity
   */
  abstract get comparableEntity(): EntityName<T>;

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

  /**
   * Get comparable's information for web application
   */
  abstract getInformation(
    comparable: Comparable,
    languageIsoCodes?: LanguageISOCodes,
  ): Promise<any>;
}
