import { Injectable } from '@nestjs/common';
import {
  TmdbBackdropSize,
  TmdbLogoSize,
  TmdbPosterSize,
  TmdbProfileSize,
  TmdbStillSize,
} from './types/tmdb.types';

@Injectable()
export class TmdbUtilService {
  private imageBaseUrl: string;

  constructor() {
    // reference: https://developer.themoviedb.org/reference/configuration-details
    this.imageBaseUrl = 'http://image.tmdb.org/t/p/';
  }

  getBackdropUrl(backdropPath: string, size?: TmdbBackdropSize) {
    return `${this.imageBaseUrl}${size ?? 'original'}${backdropPath}`;
  }

  getLogoUrl(logoPath: string, size?: TmdbLogoSize) {
    return `${this.imageBaseUrl}${size ?? 'original'}${logoPath}`;
  }

  getPosterUrl(posterPath: string, size?: TmdbPosterSize) {
    return `${this.imageBaseUrl}${size ?? 'original'}${posterPath}`;
  }

  getProfileUrl(profilePath: string, size?: TmdbProfileSize) {
    return `${this.imageBaseUrl}${size ?? 'original'}${profilePath}`;
  }

  getStillUrl(stillPath: string, size?: TmdbStillSize) {
    return `${this.imageBaseUrl}${size ?? 'original'}${stillPath}`;
  }
}
