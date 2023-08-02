import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TmdbClientModule } from './tmdb-client/tmdb-client.module';
import tmdbClientConfig from './config/tmdb-client.config';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`/.env`],
      load: [tmdbClientConfig, authConfig],
      isGlobal: true,
      // TODO: Add validation (e.g. joi)
    }),
    MikroOrmModule.forRoot(),
    TmdbClientModule,
    MovieModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
