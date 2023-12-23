import { IsEnum, IsNumber, IsNumberString } from 'class-validator';
import { ComparableType } from './types/comparable.types';

export class ComparableTypeDto {
  @IsEnum(ComparableType)
  comparableType: ComparableType;
}

export class ComparableDto extends ComparableTypeDto {
  @IsNumberString()
  comparableId: number;
}

export class ComparableIdListDto {
  @IsNumber({}, { each: true })
  comparableIds: number[];
}
