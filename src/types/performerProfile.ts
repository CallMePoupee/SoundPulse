import type { HonorItem, SidebarItem, SongMetadataDetail, SongStat, WeekEntry } from '@/types/song';

export interface PerformerReleaseItem {
  title: string;
  type: 'Album' | 'Song';
  peak: number;
  weeks: number;
  href: string;
}

export interface PerformerProfileData {
  name: string;
  genre: string;
  activeYears: string;
  origin: string;
  profileArtSrc: string;
  bannerSrc: string;
  eyebrow: string;
  stats: SongStat[];
  details: SongMetadataDetail[];
  weeks: WeekEntry[];
  releases: PerformerReleaseItem[];
  honors: HonorItem[];
  albums: SidebarItem[];
  songs: SidebarItem[];
  relatedPerformers: SidebarItem[];
}
