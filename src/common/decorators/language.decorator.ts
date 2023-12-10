import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LanguageISOCodes } from '../types/iso.types';

/**
 * @description Get language codes from request
 */
export const Language = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const languageQuery = request.query['language'];

    if (languageQuery) {
      // TODO: Add validation
      const [iso6391, iso31661] = languageQuery?.split('-');
      const language: LanguageISOCodes = {
        iso31661,
        iso6391,
      };
      return language;
    } else {
      return null;
    }
  },
);
