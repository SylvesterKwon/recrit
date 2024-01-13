import { Module } from '@nestjs/common';
import { ElasticsearchInitializationService } from './services/elasticsearch-initialization.service';

@Module({
  imports: [],
  providers: [ElasticsearchInitializationService],
})
export class ElasticsearchWrapperModule {}
