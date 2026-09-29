import type { HonorItem, SidebarItem, SongMetadataDetail, SongStat, WeekEntry } from '@/types/song';

export interface AlbumTrackItem {
  title: string;
  peak: number;
  weeks: number;
  status?: string;
  href?: string;
}

export interface AlbumData {
  title: string;
  artist: string;
  artistHref: string;
  genre: string;
  year: string;
  releaseType: string;
  albumArtSrc: string;
  eyebrow: string;
  metaText: string;
  stats: SongStat[];
  details: SongMetadataDetail[];
  weeks: WeekEntry[];
  tracks: AlbumTrackItem[];
  honors: HonorItem[];
  albumsByArtist: SidebarItem[];
  songsFromAlbum: SidebarItem[];
  relatedAlbums: SidebarItem[];
}
