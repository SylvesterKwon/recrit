import { IsEnum, IsNumberString } from 'class-validator';
import { ComparableType } from './types/comparable.types';

export class ComparableDto {
  @IsEnum(ComparableType)
  comparableType: ComparableType;

  @IsNumberString()
  comparableId: number;
}
