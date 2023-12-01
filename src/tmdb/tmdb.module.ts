import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmdbClientService } from './tmdb-client.service';
import { TmdbUtilService } from './tmdb-util.service';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [TmdbClientService, TmdbUtilService],
  providers: [TmdbClientService, TmdbUtilService],
})
export class TmdbModule {}
