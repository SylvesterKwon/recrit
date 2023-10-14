import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { TmdbClientModule } from './tmdb-client/tmdb-client.module';
import tmdbClientConfig from './config/tmdb-client.config';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';
import { Neo4jConnection, Neo4jModule, Neo4jScheme } from 'nest-neo4j';
import neo4jConfig from './config/neo4j.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`/.env`],
      load: [tmdbClientConfig, authConfig, neo4jConfig],
      isGlobal: true,
      // TODO: Add validation (e.g. joi)
    }),
    MikroOrmModule.forRoot(),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConnection => ({
        scheme: configService.get<string>('neo4j.scheme') as Neo4jScheme,
        host: configService.get<string>('neo4j.host') as string,
        port: configService.get<string>('neo4j.port') as string,
        username: configService.get<string>('neo4j.username') as string,
        password: configService.get<string>('neo4j.password') as string,
        database: configService.get<string>('neo4j.database') as string,
      }),
    }),
    TmdbClientModule,
    MovieModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
