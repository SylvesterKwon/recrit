export enum ComparableType {
  MOVIE = 'movie',
}

export type ConsumptionStatus = {
  id: number;
  consumed: boolean;
  toConsumeListed: boolean;
};

export type ConsumptionStatusesDto = {
  comparableType: ComparableType;
  consumptionStatuses: ConsumptionStatus[];
};
