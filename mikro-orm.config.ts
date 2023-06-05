import { LoadStrategy, Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// https://mikro-orm.io/docs/next/configuration#using-environment-variables

const config: Options = {
  host: process.env.MIKRO_ORM_HOST,
  port: process.env.MIKRO_ORM_PORT
    ? parseInt(process.env.MIKRO_ORM_PORT, 10)
    : undefined,
  user: process.env.MIKRO_ORM_USER,
  password: process.env.MIKRO_ORM_PASSWORD,
  dbName: process.env.MIKRO_ORM_DB_NAME,
  debug: process.env.MIKRO_ORM_DEBUG === 'true',
  type: 'mysql',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  loadStrategy: LoadStrategy.JOINED,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
