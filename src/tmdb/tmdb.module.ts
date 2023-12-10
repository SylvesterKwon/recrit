import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmdbClientService } from './services/tmdb-client.service';
import { TmdbUtilService } from './services/tmdb-util.service';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [TmdbClientService, TmdbUtilService],
  providers: [TmdbClientService, TmdbUtilService],
})
export class TmdbModule {}
