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

export class ComparableAlreadyConsumedException extends ComparableException {
  constructor() {
    super(
      ComparableErrorCode.COMPARABLE_ALREADY_CONSUMED,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ComparableNotConsumedException extends ComparableException {
  constructor() {
    super(ComparableErrorCode.COMPARABLE_NOT_CONSUMED, HttpStatus.BAD_REQUEST);
  }
}

export enum ComparableErrorCode {
  COMPARABLE_NOT_FOUND = 'COMPARABLE_NOT_FOUND',
  COMPARABLE_ALREADY_CONSUMED = 'COMPARABLE_ALREADY_CONSUMED',
  COMPARABLE_NOT_CONSUMED = 'COMPARABLE_NOT_CONSUMED',
}
