export interface PerformerStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface PerformerRow {
  name: string;
  genres: string[];
  decade: string;
  peak: number;
  numberOnes: number;
  topTen: number;
  chartingSongs: number;
  weeks: number;
  debutDate: string;
  coverSrc: string;
  href: string;
}

export interface PerformerSidebarItem {
  peak: number;
  title: string;
  performer: string;
  metric: number;
  metricLabel: string;
  href?: string;
}

export type SortKey = 'name' | 'peak' | 'numberOnes' | 'topTen' | 'chartingSongs' | 'weeks' | 'date';
