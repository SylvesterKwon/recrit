import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class ComparableException extends BaseException {
  constructor(errorCode: ComparableErrorCode, statusCode: HttpStatus) {
    super(['COMPARISON', errorCode].join(':'), statusCode);
  }
}

export class ComparableNotFoundException extends ComparableException {
  constructor() {
    super(ComparableErrorCode.COMPARABLE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class InvalidComparableTypeException extends ComparableException {
  constructor() {
    super(ComparableErrorCode.COMPARABLE_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

export enum ComparableErrorCode {
  COMPARABLE_NOT_FOUND = 'COMPARABLE_NOT_FOUND',
  INVALID_COMPARABLE_TYPE = 'INVALID_COMPARABLE_TYPE',
}
