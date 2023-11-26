import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { ComparableProxyService } from './comparable-proxy.service';
import { InvalidComparableTypeException } from 'src/common/exceptions/comparable.exception';

@Injectable()
export class ComparableApplication {
  constructor(
    private orm: MikroORM,
    private comparableProxyService: ComparableProxyService,
  ) {}

  @Transactional()
  async getComparableInforamtion(comparableType: string, comparableId: number) {
    const isValidComparableType =
      this.comparableProxyService.isValidComparableType(comparableType);
    if (!isValidComparableType) throw new InvalidComparableTypeException();
    const comparableInformation =
      await this.comparableProxyService.getComparableInformation(
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }
}
