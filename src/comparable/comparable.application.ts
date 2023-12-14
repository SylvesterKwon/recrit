import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { ComparableProxyService } from './services/comparable-proxy.service';
import { InvalidComparableTypeException } from 'src/common/exceptions/comparable.exception';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';

@Injectable()
export class ComparableApplication {
  constructor(
    private orm: MikroORM,
    private userRepository: UserRepository,
    private comparableProxyService: ComparableProxyService,
  ) {}

  @Transactional()
  async getComparableInforamtion(
    comparableType: string,
    comparableId: number,
    languageIsoCodes?: LanguageISOCodes,
  ) {
    // TODO: move validation to inside of proxy service method
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

  @Transactional()
  async consumeComparable(
    userId: number,
    comparableType: string,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const isValidComparableType =
      this.comparableProxyService.isValidComparableType(comparableType);
    if (!isValidComparableType) throw new InvalidComparableTypeException();

    const comparableInformation =
      await this.comparableProxyService.consumeComparable(
        user,
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }
}
