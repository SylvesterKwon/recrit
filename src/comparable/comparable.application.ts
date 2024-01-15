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
import { BaseApplication } from 'src/common/applications/base.applicaiton';
import { EventManagerService } from 'src/event-manager/event-manager.service';

@Injectable()
export class ComparableApplication extends BaseApplication {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private userRepository: UserRepository,
    private comparableProxyService: ComparableProxyService,
  ) {
    super();
  }

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

    const comsumptionStatus =
      await this.comparableProxyService.consumeComparable(
        user,
        comparableType,
        comparableId,
      );
    return comsumptionStatus;
  }

  @Transactional()
  async unconsumeComparable(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comsumptionStatus =
      await this.comparableProxyService.unconsumeComparable(
        user,
        comparableType,
        comparableId,
      );
    return comsumptionStatus;
  }

  @Transactional()
  async addToConsumeList(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comsumptionStatus =
      await this.comparableProxyService.addToConsumeList(
        user,
        comparableType,
        comparableId,
      );
    return comsumptionStatus;
  }

  @Transactional()
  async removeToConsumeList(
    userId: number,
    comparableType: ComparableType,
    comparableId: number,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const comsumptionStatus =
      await this.comparableProxyService.removeToConsumeList(
        user,
        comparableType,
        comparableId,
      );
    return comsumptionStatus;
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
      consumptionStatuses,
    };
  }
}
