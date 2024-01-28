import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchInitializationService {
  constructor(private elasticsearchService: ElasticsearchService) {
    this.initializeIndex();
  }

  /**
   * Initialize all Elasticsearch indices.
   */
  async initializeIndex() {
    const elasticsearchIndices = Object.keys(ElasticsearchIndex) as Array<
      keyof typeof ElasticsearchIndex
    >;

    await Promise.allSettled(
      elasticsearchIndices.map((index) => {
        return async () => {
          const indexExists = await this.elasticsearchService.indices.exists({
            index,
          });
          if (!indexExists) {
            console.log(
              `[Elasticsearch] ${index} index does not exist, creating...`,
            );
            // TODO: 아랫 라인 제거하기, (우선은 인덱스 관리는 및 매핑은 elasticsearch 서비스에 직접 HTTP 로 요청하도록)
            return await this.elasticsearchService.indices.create({
              index,
              mappings: {
                properties: {
                  title: {
                    type: 'text',
                    analyzer: 'english',
                  },
                  originalTitle: {
                    type: 'text',
                  },
                  translation: {
                    type: 'nested',
                    properties: {
                      'en-US': {
                        type: 'text',
                        analyzer: 'english',
                      },
                      // 구조 고민중. 인덱스 버저닝은 어떻게할지, 매핑 정보는 어디서가지고 있을지
                      // 매핑정보는 어떻게 재활용할지 (언어별로?)
                      // 'ko-KR': {
                      //   type: 'text',
                      //   // analyzer: 'korean',
                      // },
                    },
                  },
                },
              },
            });
          }
        };
      }),
    );
  }
}

export enum ElasticsearchIndex {
  Movie = 'movie',
}
