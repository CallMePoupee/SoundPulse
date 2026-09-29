export interface SongArchiveStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface SongArchiveRow {
  title: string;
  performer: string;
  genres: string[];
  decade: string;
  peak: number;
  weeksOn: number;
  weeksAtOne: number;
  topTenWeeks: number;
  debutPosition: number;
  debutDate: string;
  coverSrc: string;
  href: string;
}

export interface SongArchiveSidebarItem {
  peak: number;
  title: string;
  performer: string;
  metric: number;
  metricLabel: string;
  href?: string;
}

export type SongSortKey =
  | 'title'
  | 'peak'
  | 'weeksOn'
  | 'weeksAtOne'
  | 'topTenWeeks'
  | 'debutPosition'
  | 'date';
