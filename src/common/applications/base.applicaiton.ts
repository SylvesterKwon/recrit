import { MikroORM } from '@mikro-orm/core';
import { EventManagerService } from '../../event-manager/event-manager.service';

export abstract class BaseApplication {
  protected abstract orm: MikroORM;
  protected abstract eventManagerService: EventManagerService;
}

export abstract class BaseTask extends BaseApplication {}
