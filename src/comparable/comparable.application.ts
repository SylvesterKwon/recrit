import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { ComparableProxyService } from './services/comparable-proxy.service';
import { InvalidComparableTypeException } from 'src/common/exceptions/comparable.exception';
import { LanguageISOCodes } from 'src/common/types/iso.types';

@Injectable()
export class ComparableApplication {
  constructor(
    private orm: MikroORM,
    private comparableProxyService: ComparableProxyService,
  ) {}

  @Transactional()
  async getComparableInforamtion(
    comparableType: string,
    comparableId: number,
    languageIsoCodes?: LanguageISOCodes,
  ) {
    const isValidComparableType =
      this.comparableProxyService.isValidComparableType(comparableType);
    if (!isValidComparableType) throw new InvalidComparableTypeException();
    const comparableInformation =
      await this.comparableProxyService.getComparableInformation(
        comparableType,
        comparableId,
        languageIsoCodes,
      );
    return comparableInformation;
  }
}
