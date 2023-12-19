import { User } from 'src/user/entities/user.entity';
import { Comparable } from '../entities/comparable.entity';
import { LanguageISOCodes } from '../types/iso.types';

/**
 * Base comparable service. All comparable services must extend this class
 */
export abstract class BaseComparableService {
  /**
   * Returns the related entity of the comparable service
   */
  abstract get relatedEntity(): typeof Comparable;

  /**
   * Get comparable's information for web application
   */
  abstract getInformation(
    comparable: Comparable,
    languageIsoCodes?: LanguageISOCodes,
  ): Promise<any>;

  /**
   * Mark comparable as consumed by user
   */
  abstract consume(user: User, comparable: Comparable): Promise<void>;

  /**
   * Unmark comparable as consumed by user
   */
  abstract unconsume(user: User, comparable: Comparable): Promise<void>;

  /**
   * Add comparable to to-consume-list
   */
  abstract addToConsumeList(user: User, comparable: Comparable): Promise<void>;

  /**
   * Remove comparable from to-consume-list
   */
  abstract removeToConsumeList(
    user: User,
    comparable: Comparable,
  ): Promise<void>;
}
