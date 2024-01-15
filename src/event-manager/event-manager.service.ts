// TODO: 디렉토리 재설정하기

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ClsService } from 'nestjs-cls';
import { BaseEvent } from 'src/common/events/base.event';

@Injectable()
export class EventManagerService {
  constructor(
    private clsService: ClsService<EventQueue>,
    @Inject('RECRIT_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  /**
   * Enqueue event to be emitted later. It will be emitted when request-scoped transaction is committed.
   */
  enqueueEvent(event: BaseEvent) {
    const queuedEvents = this.clsService.get('queuedEvents') ?? [];
    queuedEvents.push(event);
    this.clsService.set('queuedEvents', queuedEvents);

    if (process.env.ENVIRONMENT === 'local')
      console.log('Event queued: ', event);
  }

  /**
   * Emit all queued events
   */
  emitAllEvents() {
    const queuedEvents = this.clsService.get('queuedEvents');
    if (!queuedEvents) return;
    queuedEvents.map((event) => {
      this.kafkaClient.emit(event.eventPattern, event);
    });

    if (process.env.ENVIRONMENT === 'local')
      console.log('Event emitted: ', queuedEvents);
  }
}

type EventQueue = { queuedEvents?: BaseEvent[] };
