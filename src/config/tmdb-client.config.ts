import { registerAs } from '@nestjs/config';

export default registerAs('tmdbClient', () => ({
  tmdbApiKey: process.env.TMDB_API_KEY,
  tmdbApiReadAccessToken: process.env.TMDB_API_READ_ACCESS_TOKEN,
}));
