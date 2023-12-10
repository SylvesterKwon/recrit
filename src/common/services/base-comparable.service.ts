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
}
