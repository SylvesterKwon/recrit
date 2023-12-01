import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmdbClientService } from './tmdb-client.service';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [TmdbClientService],
  providers: [TmdbClientService],
})
export class TmdbModule {}
