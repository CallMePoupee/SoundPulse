export type ChartEra = 'modern-rock-tracks' | 'alternative-songs' | 'alternative-airplay';

export type MoveDirection = 'up' | 'down' | 'new' | 're' | null;

export type RowStatus = 'no1' | 'newpeak' | 'new' | 're' | null;

export type EventClass =
  | 'chart-leader'
  | 'prime-contender'
  | 'biggest-climb'
  | 'breakout-track'
  | 'highest-debut'
  | 'longest-run'
  | 'biggest-drop'
  | null;

export interface ChartEntry {
  rank: number;
  previous: string;
  move: string;
  moveClass: MoveDirection;
  song: string;
  performer: string;
  album: string;
  note: string;
  suffix: string;
  peak: number;
  weeks: number;
  status?: RowStatus;
  eventClass?: EventClass;
  eventLabel?: string;
  stateNote?: string;
}

export interface ChartEvent {
  eventClass: string;
  badgeValue: string;
  badgeArrow?: 'up' | 'down';
  badgeSuperscript?: string;
  badgeLabel: string;
  label: string;
  copy: React.ReactNode;
}

export interface WeeklyChart {
  era: ChartEra;
  eraLabel: string;
  weekDate: string;
  weekLabel: string;
  prevWeekLabel: string;
  prevWeekHref: string;
  nextWeekLabel: string;
  nextWeekHref: string;
  entries: ChartEntry[];
  events: ChartEvent[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
