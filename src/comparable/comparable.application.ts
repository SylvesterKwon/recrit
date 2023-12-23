import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { ComparableProxyService } from './services/comparable-proxy.service';
import { LanguageISOCodes } from 'src/common/types/iso.types';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import {
  ConsumptionStatusesDto,
  ComparableType,
} from './types/comparable.types';

@Injectable()
export class ComparableApplication {
  constructor(
    private orm: MikroORM,
    private userRepository: UserRepository,
    private comparableProxyService: ComparableProxyService,
  ) {}

  @Transactional()
  async getComparableInforamtion(
    comparableType: ComparableType,
    comparableId: number,
    languageIsoCodes?: LanguageISOCodes,
  ) {
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
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comparableInformation =
      await this.comparableProxyService.consumeComparable(
        user,
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }

  @Transactional()
  async unconsumeComparable(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comparableInformation =
      await this.comparableProxyService.unconsumeComparable(
        user,
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }

  @Transactional()
  async addToConsumeList(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comparableInformation =
      await this.comparableProxyService.addToConsumeList(
        user,
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }

  @Transactional()
  async removeToConsumeList(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comparableInformation =
      await this.comparableProxyService.removeToConsumeList(
        user,
        comparableType,
        comparableId,
      );
    return comparableInformation;
  }

  @Transactional()
  async getConsumptionStatuses(
    userId: number,
    comparableType: ComparableType,
    comparableIds: number[],
  ): Promise<ConsumptionStatusesDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const consumptionStatuses =
      await this.comparableProxyService.getConsumptionStatuses(
        user,
        comparableType,
        comparableIds,
      );
    return {
      comparableType: comparableType,
      consumptionStatuses,
    };
  }
}
