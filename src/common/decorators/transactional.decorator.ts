import { TransactionOptions, CreateRequestContext } from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';
import { BaseApplication } from '../applications/base.applicaiton';

/**
 * Decorator that applys DB transaction functionality to the following method.
 * @param options See MikroORM [TransactionOptions](https://mikro-orm.io/api/next/core/interface/TransactionOptions).
 */
function MikroORMTransactional(options?: TransactionOptions) {
  return function (
    target: BaseApplication,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: BaseApplication, ...args: any[]) {
      // MikroORM transaction
      const result = await this.orm.em.transactional(async () => {
        return await originalMethod.apply(this, args);
      }, options);

      // After transaction, emit all queued events
      this.eventManagerService.emitAllEvents();
      return result;
    };
  };
}

/**
 * Decorator that applys DB transaction functionality to the following method.
 * Since it is applied on a request context, it *must* be used in the method of application layer class that has `orm` property.
 * @param options See MikroORM [TransactionOptions](https://mikro-orm.io/api/next/core/interface/TransactionOptions).
 */
export const Transactional = (options?: TransactionOptions) =>
  applyDecorators(CreateRequestContext(), MikroORMTransactional(options));
