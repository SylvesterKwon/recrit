import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { BaseApplication } from 'src/common/applications/base.applicaiton';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { MovieService } from './services/movie.service';
import { MovieFilter } from './types/movie.types';
import { LanguageISOCodes } from 'src/common/types/iso.types';

@Injectable()
export class MovieApplication extends BaseApplication {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private movieService: MovieService,
  ) {
    super();
  }

  async getList(movieFilter: MovieFilter, languageIsoCodes?: LanguageISOCodes) {
    return await this.movieService.getList(movieFilter, languageIsoCodes);
  }
}
