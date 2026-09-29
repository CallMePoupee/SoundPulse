import type { PerformerStat, PerformerRow, PerformerSidebarItem } from '@/types/performer';
import { performerPath, performerCoverSrc } from '@/utils/slug';

function p(name: string, genres: string[], decade: string, peak: number, numberOnes: number, topTen: number, chartingSongs: number, weeks: number, debutDate: string): PerformerRow {
  return {
    name,
    genres,
    decade,
    peak,
    numberOnes,
    topTen,
    chartingSongs,
    weeks,
    debutDate,
    coverSrc: performerCoverSrc(name),
    href: performerPath(name),
  };
}

export const performerStats: PerformerStat[] = [
  { label: 'Charting Performers', value: '934', highlight: true },
  { label: 'Multiple #1 Performers', value: '42' },
  { label: '#1 Performers', value: '186' },
  { label: 'Top 10 Performers', value: '518' },
  { label: 'One-Hit Wonders', value: '127' },
];

export const performers: PerformerRow[] = [
  p('Three Days Grace', ['Post-Grunge', 'Alt. Rock'], '2000s', 1, 7, 18, 27, 44, '2004-07-24'),
  p('Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 6, 15, 24, 39, '2002-08-17'),
  p('System of a Down', ['Alt. Metal', 'Nu Metal'], '1990s', 1, 4, 13, 21, 31, '1998-09-12'),
  p('Placebo', ['Alt. Rock', 'Post-Punk Rev.'], '1990s', 2, 0, 9, 19, 28, '1996-07-20'),
  p('Cake', ['Alt. Rock', 'Funk Rock'], '1990s', 2, 1, 8, 17, 25, '1996-10-05'),
  p('Seether', ['Post-Grunge', 'Alt. Metal'], '2000s', 1, 5, 14, 23, 36, '2002-09-07'),
  p('Shinedown', ['Hard Rock', 'Post-Grunge'], '2000s', 4, 0, 6, 12, 22, '2003-06-21'),
  p('Stone Sour', ['Alt. Metal', 'Hard Rock'], '2000s', 5, 0, 5, 11, 20, '2002-11-09'),
  p('Red', ['Alt. Metal', 'Alt. Rock'], '2000s', 12, 0, 0, 1, 8, '2006-06-24'),
  p('Evans Blue', ['Post-Grunge', 'Alt. Rock'], '2000s', 18, 0, 0, 1, 7, '2006-07-15'),
  p('10 Years', ['Alt. Rock', 'Alt. Metal'], '2000s', 23, 0, 0, 1, 6, '2005-09-03'),
  p('Flyleaf', ['Alt. Rock', 'Nu Metal'], '2000s', 27, 0, 0, 1, 5, '2006-04-01'),
  p('Hinder', ['Post-Grunge', 'Hard Rock'], '2000s', 35, 0, 0, 1, 4, '2006-10-14'),
  p('Linkin Park', ['Alt. Rock', 'Nu Metal'], '2000s', 1, 8, 20, 31, 52, '2000-10-28'),
  p('Foo Fighters', ['Alt. Rock', 'Post-Grunge'], '1990s', 1, 7, 19, 29, 48, '1995-08-12'),
  p('Green Day', ['Pop Punk', 'Alt. Rock'], '1990s', 1, 6, 17, 27, 45, '1994-02-19'),
  p('Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 5, 15, 24, 41, '2000-03-18'),
  p('Red Hot Chili Peppers', ['Alt. Rock', 'Funk Rock'], '1980s', 1, 4, 14, 22, 39, '1989-09-23'),
];

export const decadeOptions = ['2020s', '2010s', '2000s', '1990s', '1980s'];

export const genreOptions = [
  'Alt. Metal', 'Alt. Rock', 'Art Rock', 'Funk Rock',
  'Hard Rock', 'Nu Metal', 'Pop Punk', 'Post-Grunge', 'Post-Punk Rev.',
];

export const sortOptions: { key: import('@/types/performer').SortKey; label: string }[] = [
  { key: 'name', label: 'A - Z' },
  { key: 'peak', label: 'Peak' },
  { key: 'numberOnes', label: '#1 Songs' },
  { key: 'topTen', label: 'Top 10s' },
  { key: 'chartingSongs', label: 'Songs' },
  { key: 'weeks', label: 'Weeks' },
];

export const alphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function si(peak: number, title: string, performer: string, metric: number): PerformerSidebarItem {
  return { peak, title, performer, metric, metricLabel: 'WEEKS', href: performerPath(performer) };
}

export const sidebarPerformersOfMoment: PerformerSidebarItem[] = [
  si(1, 'Linkin Park', 'Linkin Park', 52),
  si(1, 'Three Days Grace', 'Three Days Grace', 44),
  si(1, 'Breaking Benjamin', 'Breaking Benjamin', 39),
  si(1, 'Seether', 'Seether', 36),
  si(4, 'Shinedown', 'Shinedown', 22),
];

export const sidebarPopular5Years: PerformerSidebarItem[] = [
  si(1, 'Three Days Grace', 'Three Days Grace', 44),
  si(1, 'Breaking Benjamin', 'Breaking Benjamin', 39),
  si(1, 'Seether', 'Seether', 36),
  si(1, 'Muse', 'Muse', 41),
  si(1, 'Linkin Park', 'Linkin Park', 52),
];

export const sidebarPopular10Years: PerformerSidebarItem[] = [
  si(1, 'Linkin Park', 'Linkin Park', 52),
  si(1, 'Foo Fighters', 'Foo Fighters', 48),
  si(1, 'Green Day', 'Green Day', 45),
  si(1, 'Muse', 'Muse', 41),
  si(1, 'Red Hot Chili Peppers', 'Red Hot Chili Peppers', 39),
];

export const sidebarPopular20Years: PerformerSidebarItem[] = [
  si(1, 'Linkin Park', 'Linkin Park', 52),
  si(1, 'Three Days Grace', 'Three Days Grace', 44),
  si(1, 'Breaking Benjamin', 'Breaking Benjamin', 39),
  si(1, 'Seether', 'Seether', 36),
  si(4, 'Shinedown', 'Shinedown', 22),
];

export const sidebarPopular30Years: PerformerSidebarItem[] = [
  si(1, 'Foo Fighters', 'Foo Fighters', 48),
  si(1, 'Green Day', 'Green Day', 45),
  si(1, 'System of a Down', 'System of a Down', 31),
  si(2, 'Placebo', 'Placebo', 28),
  si(2, 'Cake', 'Cake', 25),
];
