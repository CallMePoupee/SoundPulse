export interface SongStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface WeekEntry {
  date: string;
  href: string;
  rank: number;
  change: string;
  changeType: 'positive' | 'negative' | 'muted';
  weeks: number;
  isTop10?: boolean;
  milestone?: string;
}

export interface SongMetadataDetail {
  label: string;
  value: string;
  href?: string;
}

export interface HonorItem {
  badgeSrc: string;
  badgeAlt: string;
  title: string;
  description: string;
}

export interface SidebarItem {
  peak: number;
  title: string;
  performer: string;
  metric: number;
  metricLabel: string;
  href?: string;
}

export interface SongData {
  title: string;
  artist: string;
  artistHref: string;
  album: string;
  albumHref: string;
  genre: string;
  year: string;
  singleOrder: string;
  singleArtSrc: string;
  eyebrow: string;
  metaText: string;
  metaLink: string;
  metaLinkHref: string;
  stats: SongStat[];
  details: SongMetadataDetail[];
  weeks: WeekEntry[];
  honors: HonorItem[];
  albumsByArtist: SidebarItem[];
  songsByArtist: SidebarItem[];
  relatedSongs: SidebarItem[];
}
