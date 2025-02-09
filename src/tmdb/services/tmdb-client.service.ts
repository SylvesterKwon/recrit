import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs, { Dayjs } from 'dayjs';
import zlib from 'zlib';
import readline from 'readline';
import { firstValueFrom } from 'rxjs';
import { MovieDb } from 'moviedb-promise';
import { MovieGenre } from 'src/movie/entities/movie-genre.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { MovieRelations } from 'src/movie/types/movie.types';
import { ISO31661, ISO6391 } from 'src/common/types/iso.types';
import {
  MovieTranslationsResponseWithTagline,
  TmdbMovieIdResponse,
} from '../types/tmdb-client.types';
import { EntityData, RequiredEntityData } from '@mikro-orm/core';
import {
  WithRequiredProp,
  WithRequiredProps,
} from 'src/common/types/utility.types';
import { MovieTranslation } from 'src/movie/entities/movie-translation.entity';

@Injectable()
export class TmdbClientService {
  private movieDb: MovieDb;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('tmdbClient.tmdbApiKey');
    if (!apiKey) {
      throw new Error('TMDB API Key not found');
    }

    this.movieDb = new MovieDb(apiKey);
  }

  async getMovie(tmdbId: number) {
    const res = await this.movieDb.movieInfo({ id: tmdbId });
    const tmdbMovieData: {
      movieProps: WithRequiredProp<EntityData<Movie>, 'tmdbId'>; // simple properties
      movieRelations: MovieRelations; // relations
    } = {
      movieProps: {
        tmdbId: res.id as number,
        adult: res.adult,
        backdropPath: res.backdrop_path,
        budget: res.budget,
        homepage: res.homepage,
        imdbId: res.imdb_id,
        originalLanguage: res.original_language,
        originalTitle: res.original_title,
        overview: res.overview,
        posterPath: res.poster_path,
        releaseDate: res.release_date
          ? dayjs(res.release_date).toDate()
          : undefined,
        revenue: res.revenue,
        runtime: res.runtime,
        status: res.status,
        tagline: res.tagline,
        title: res.title,
        video: res.video,
        productionCountryCodes:
          res.production_countries?.map(
            (country) => country.iso_3166_1 as ISO31661,
          ) ?? [],
        spokenLanguageCodes:
          res.spoken_languages?.map(
            (language) => language.iso_639_1 as ISO6391,
          ) ?? [],
      },
      movieRelations: {
        genreTmdbIds: res.genres?.map((genre) => genre.id as number) ?? [],
        productionCompanyTmdbIds:
          res.production_companies?.map((company) => company.id as number) ??
          [],
      },
    };
    return tmdbMovieData;
  }

  async getMovieTranslations(tmdbId: number) {
    const res = (await this.movieDb.movieTranslations({
      id: tmdbId,
    })) as MovieTranslationsResponseWithTagline;

    const movieTranslationDataList: Omit<
      RequiredEntityData<MovieTranslation>,
      'movie'
    >[] =
      res.translations?.map((translation) => ({
        iso31661: translation.iso_3166_1 as ISO31661,
        iso6391: translation.iso_639_1 as ISO6391,
        homepage: translation.data?.homepage,
        overview: translation.data?.overview,
        tagline: translation.data?.tagline,
        title: translation.data?.title,
      })) ?? [];

    return movieTranslationDataList;
  }

  async getAllMovieGenres(language: ISO6391) {
    const res = await this.movieDb.genreMovieList({ language: language });
    if (!res.genres) {
      throw new Error('No genres found');
    }
    const tmdbMovieGenresData: WithRequiredProps<
      RequiredEntityData<MovieGenre>,
      ['tmdbId']
    >[] = res.genres
      .filter((genre): genre is { id: number; name: string } =>
        Boolean(genre.id && genre.name),
      )
      .map((genre) => ({
        tmdbId: genre.id,
        name: genre.name,
      }));
    return tmdbMovieGenresData;
  }

  private getDailyFileExportsUrl(date: Dayjs) {
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');
    return `https://files.tmdb.org/p/exports/movie_ids_${month}_${day}_${year}.json.gz`;
  }

  // reference: https://developer.themoviedb.org/docs/daily-id-exports
  async getValidTmdbMovieIdsByDate(date: Dayjs) {
    const res = await firstValueFrom(
      this.httpService.get(this.getDailyFileExportsUrl(date), {
        responseType: 'stream',
      }),
    );
    const stream: NodeJS.ReadableStream = res.data.pipe(zlib.createGunzip());
    const rl = readline.createInterface({ input: stream });
    const validTmdbMovieIds: number[] = [];

    for await (const line of rl) {
      const parsedLine: TmdbMovieIdResponse = JSON.parse(line);
      validTmdbMovieIds.push(parsedLine.id);
    }

    const sortedValidTmdbMovieIds = validTmdbMovieIds.sort((a, b) => a - b);
    return sortedValidTmdbMovieIds;
  }
}
