export type WithRequiredProp<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithRequiredProps<T, K extends (keyof T)[]> = T &
  Required<Pick<T, K[number]>>;
