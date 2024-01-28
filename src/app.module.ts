import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TmdbModule } from './tmdb/tmdb.module';
import tmdbClientConfig from './config/tmdb-client.config';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';
import { Neo4jConnection, Neo4jModule, Neo4jScheme } from 'nest-neo4j';
import neo4jConfig from './config/neo4j.config';
import { GraphModule } from './graph/graph.module';
import { ComparisonModule } from './comparison/comparison.module';
import { ComparableModule } from './comparable/comparable.module';
import kafkaConfig from './config/kafka.config';
import { AppController } from './app.controller';
import { ClsModule } from 'nestjs-cls';
import { EventManagerModule } from './event-manager/event-manager.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import elasticsearchConfig from './config/elasticsearch.config';
import { ElasticsearchWrapperModule } from './elaticsearch/elasticserach-wrapper.module';
import fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [
        tmdbClientConfig,
        authConfig,
        neo4jConfig,
        kafkaConfig,
        elasticsearchConfig,
      ],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
      global: true,
    }),
    EventManagerModule,
    MikroOrmModule.forRoot(),
    {
      // ElastchsearchModule dose not support forRoot/forRootAsync
      ...ElasticsearchModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          node: configService.get<string>('elasticsearch.node') as string,
          auth: {
            username: configService.get<string>(
              'elasticsearch.username',
            ) as string,
            password: configService.get<string>(
              'elasticsearch.password',
            ) as string,
          },
          tls: {
            ca: fs.readFileSync('./http_ca.crt'),
          },
        }),
      }),
      global: true,
    },
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConnection => ({
        scheme: configService.get<Neo4jScheme>('neo4j.scheme') as Neo4jScheme,
        host: configService.get<string>('neo4j.host') as string,
        port: configService.get<string>('neo4j.port') as string,
        username: configService.get<string>('neo4j.username') as string,
        password: configService.get<string>('neo4j.password') as string,
        database: configService.get<string>('neo4j.database') as string,
        config: {
          disableLosslessIntegers: true, // reference: https://github.com/neo4j/neo4j-javascript-driver#enable-native-numbers
        },
      }),
    }),
    ComparisonModule,
    ComparableModule,
    TmdbModule,
    MovieModule,
    UserModule,
    GraphModule,
    ElasticsearchWrapperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
