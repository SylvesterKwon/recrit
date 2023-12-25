export enum ComparableType {
  MOVIE = 'movie',
}

export type ConsumptionStatus = {
  comparableType: ComparableType;
  comparableId: number;
  consumed: boolean;
  toConsumeListed: boolean;
};

export type ConsumptionStatusesDto = {
  consumptionStatuses: ConsumptionStatus[];
};
