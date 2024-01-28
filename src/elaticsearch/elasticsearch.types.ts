export type ElasticsearchMovieDocument = {
  title: string;
  originalTitle: string;
  translation: Record<string, string | undefined>;
};
