export interface PageBlock {
  title: string;
  lines: string[];
  /** false — блок требует бизнес-данных и не публикуется как текст. */
  ready: boolean;
}

export interface PageContent {
  title: string;
  description: string;
  h1: string;
  blocks: PageBlock[];
}
