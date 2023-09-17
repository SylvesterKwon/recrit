import {
  MikroORM,
  TransactionOptions,
  UseRequestContext,
} from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';

/**
 * Decorator that applys DB transaction functionality to the following method.
 * @param options See MikroORM [TransactionOptions](https://mikro-orm.io/api/next/core/interface/TransactionOptions).
 */
function MikroORMTransactional(options?: TransactionOptions) {
  return function (
    target: ApplicationWithMikroORM,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      this: ApplicationWithMikroORM,
      ...args: any[]
    ) {
      const orm = this.orm;
      return await orm.em.transactional(async () => {
        return await originalMethod.apply(this, args);
      }, options);
    };
  };
}

/**
 * Decorator that applys DB transaction functionality to the following method.
 * Since it is applied on a request context, it *must* be used in the method of application layer class that has `orm` property.
 * @param options See MikroORM [TransactionOptions](https://mikro-orm.io/api/next/core/interface/TransactionOptions).
 */
export const Transactional = (options?: TransactionOptions) =>
  applyDecorators(UseRequestContext(), MikroORMTransactional(options));

type ApplicationWithMikroORM = {
  orm: MikroORM;
};
