import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  url: process.env.KAFKA_URL,
}));
