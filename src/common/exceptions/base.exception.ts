import { HttpException } from '@nestjs/common';

/**
 * @description Base exception class for custom exceptions.
 * All custom exceptions should extend this class.
 */
export class BaseException extends HttpException {
  errorCode: string; // TODO: rename this as exceptionCode, exception isn't equivalant to error

  constructor(errorCode: string, statusCode: number) {
    const fullErrorCode = ['RECRIT', errorCode].join(':');
    super(fullErrorCode, statusCode);
    this.errorCode = fullErrorCode;
  }
}
