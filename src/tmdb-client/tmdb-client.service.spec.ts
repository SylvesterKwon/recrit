import { Test, TestingModule } from '@nestjs/testing';
import { TmdbClientService } from './tmdb-client.service';

describe('TmdbClientService', () => {
  let service: TmdbClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmdbClientService],
    }).compile();

    service = module.get<TmdbClientService>(TmdbClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
