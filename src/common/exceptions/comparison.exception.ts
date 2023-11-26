import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class ComparisonException extends BaseException {
  constructor(errorCode: ComparisonErrorCode, statusCode: HttpStatus) {
    super(['COMPARISON', errorCode].join(':'), statusCode);
  }
}

export class ComparableNotFoundException extends ComparisonException {
  constructor() {
    super(ComparisonErrorCode.COMPARABLE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class SameComparisonExistsException extends ComparisonException {
  constructor() {
    super(ComparisonErrorCode.SAME_COMPARISON_EXISTS, HttpStatus.BAD_REQUEST);
  }
}

export enum ComparisonErrorCode {
  COMPARABLE_NOT_FOUND = 'COMPARABLE_NOT_FOUND',
  SAME_COMPARISON_EXISTS = 'SAME_COMPARISON_EXISTS',
}
