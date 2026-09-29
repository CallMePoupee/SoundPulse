export interface AlbumArchiveStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface AlbumArchiveRow {
  title: string;
  performer: string;
  genres: string[];
  decade: string;
  peak: number;
  weeksOn: number;
  weeksAtOne: number;
  topTenWeeks: number;
  chartingSongs: number;
  debutDate: string;
  coverSrc: string;
  href: string;
}

export interface AlbumArchiveSidebarItem {
  peak: number;
  title: string;
  performer: string;
  metric: number;
  metricLabel: string;
  href?: string;
}

export type AlbumSortKey =
  | 'title'
  | 'peak'
  | 'weeksOn'
  | 'weeksAtOne'
  | 'topTenWeeks'
  | 'chartingSongs'
  | 'date';
