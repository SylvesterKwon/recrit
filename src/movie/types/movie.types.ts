export type MovieStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';

export type MovieRelations = {
  genreTmdbIds: number[];
};
