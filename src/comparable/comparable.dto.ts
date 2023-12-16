import { IsEnum, IsNumberString } from 'class-validator';
import { ComparableType } from './types/comparable.types';

export class ComparableDto {
  @IsEnum(ComparableType)
  comparableType: string;

  @IsNumberString()
  comparableId: number;
}

export class GetComparableInformationDto extends ComparableDto {}

export class ConsumeComparableDto extends ComparableDto {}
