import type {
  SongArchiveStat,
  SongArchiveRow,
  SongArchiveSidebarItem,
} from '@/types/songArchive';
import { songPath, songCoverSrc } from '@/utils/slug';

function s(
  title: string,
  performer: string,
  genres: string[],
  decade: string,
  peak: number,
  weeksOn: number,
  weeksAtOne: number,
  topTenWeeks: number,
  debutPosition: number,
  debutDate: string,
): SongArchiveRow {
  return {
    title,
    performer,
    genres,
    decade,
    peak,
    weeksOn,
    weeksAtOne,
    topTenWeeks,
    debutPosition,
    debutDate,
    coverSrc: songCoverSrc(performer, 'singles', title),
    href: songPath(performer, 'singles', title),
  };
}

export const songArchiveStats: SongArchiveStat[] = [
  { label: 'Charting Songs', value: '2 418', highlight: true },
  { label: 'Multiple #1 Songs', value: '89' },
  { label: '#1 Songs', value: '312' },
  { label: 'Top 10 Songs', value: '746' },
  { label: 'One-Hit Wonders', value: '241' },
];

export const songArchiveRows: SongArchiveRow[] = [
  s('The Diary of Jane', 'Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 31, 3, 12, 12, '2006-06-10'),
  s('Breath', 'Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 38, 2, 15, 8, '2006-01-14'),
  s('So Cold', 'Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 37, 1, 14, 15, '2004-07-17'),
  s('Remedy', 'Seether', ['Post-Grunge', 'Alt. Metal'], '2000s', 1, 28, 2, 10, 18, '2005-08-20'),
  s('Fake It', 'Seether', ['Post-Grunge', 'Alt. Metal'], '2000s', 1, 32, 3, 13, 14, '2007-09-08'),
  s('Second Chance', 'Shinedown', ['Hard Rock', 'Post-Grunge'], '2000s', 1, 34, 2, 16, 10, '2008-09-28'),
  s('Save Me', 'Shinedown', ['Hard Rock', 'Post-Grunge'], '2000s', 1, 29, 1, 11, 16, '2005-08-02'),
  s('Through Glass', 'Stone Sour', ['Alt. Metal', 'Hard Rock'], '2000s', 2, 37, 0, 9, 20, '2006-07-22'),
  s('Paralyzer', 'Finger Eleven', ['Alt. Rock', 'Post-Grunge'], '2000s', 1, 52, 4, 21, 6, '2007-03-24'),
  s('Animal I Have Become', 'Three Days Grace', ['Post-Grunge', 'Alt. Rock'], '2000s', 1, 36, 3, 14, 9, '2006-01-21'),
  s('Pain', 'Three Days Grace', ['Post-Grunge', 'Alt. Rock'], '2000s', 1, 33, 2, 13, 11, '2006-10-07'),
  s('Never Too Late', 'Three Days Grace', ['Post-Grunge', 'Alt. Rock'], '2000s', 1, 30, 1, 12, 13, '2007-04-14'),
  s('Numb', 'Linkin Park', ['Alt. Rock', 'Nu Metal'], '2000s', 1, 52, 5, 22, 5, '2003-09-06'),
  s('In the End', 'Linkin Park', ['Alt. Rock', 'Nu Metal'], '2000s', 1, 48, 4, 19, 7, '2001-12-04'),
  s('Boulevard of Broken Dreams', 'Green Day', ['Pop Punk', 'Alt. Rock'], '2000s', 1, 45, 3, 18, 4, '2004-11-06'),
  s('Supermassive Black Hole', 'Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 41, 2, 15, 9, '2006-07-15'),
  s('Uprising', 'Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 39, 2, 14, 8, '2009-09-12'),
  s('Californication', 'Red Hot Chili Peppers', ['Alt. Rock', 'Funk Rock'], '1990s', 1, 39, 2, 16, 7, '1999-06-26'),
  s('Galileo', 'Indigo Girls', ['Folk Pop', 'Americana'], '1990s', 10, 10, 0, 2, 19, '1992-05-16'),
];

export const songDecadeOptions = ['2020s', '2010s', '2000s', '1990s', '1980s'];

export const songGenreOptions = [
  'Alt. Metal', 'Alt. Rock', 'Americana', 'Art Rock',
  'Folk Pop', 'Funk Rock', 'Hard Rock', 'Nu Metal',
  'Pop Punk', 'Post-Grunge', 'Post-Punk Rev.',
];

export const songSortOptions: { key: import('@/types/songArchive').SongSortKey; label: string }[] = [
  { key: 'title', label: 'A - Z' },
  { key: 'peak', label: 'Peak' },
  { key: 'weeksAtOne', label: '#1 Weeks' },
  { key: 'topTenWeeks', label: 'Top 10 Weeks' },
  { key: 'weeksOn', label: 'Weeks on Chart' },
  { key: 'debutPosition', label: 'Debut Position' },
];

export const songAlphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function si(peak: number, title: string, performer: string, metric: number): SongArchiveSidebarItem {
  return { peak, title, performer, metric, metricLabel: 'WEEKS', href: songPath(performer, 'singles', title) };
}

export const sidebarSongsOfMoment: SongArchiveSidebarItem[] = [
  si(1, 'Numb', 'Linkin Park', 52),
  si(1, 'Paralyzer', 'Finger Eleven', 52),
  si(1, 'In the End', 'Linkin Park', 48),
  si(1, 'Boulevard of Broken Dreams', 'Green Day', 45),
  si(1, 'Breath', 'Breaking Benjamin', 38),
];

export const sidebarPopular5YearsSongs: SongArchiveSidebarItem[] = [
  si(1, 'Paralyzer', 'Finger Eleven', 52),
  si(1, 'Second Chance', 'Shinedown', 34),
  si(1, 'Fake It', 'Seether', 32),
  si(1, 'Pain', 'Three Days Grace', 33),
  si(1, 'Never Too Late', 'Three Days Grace', 30),
];

export const sidebarPopular10YearsSongs: SongArchiveSidebarItem[] = [
  si(1, 'Numb', 'Linkin Park', 52),
  si(1, 'In the End', 'Linkin Park', 48),
  si(1, 'Boulevard of Broken Dreams', 'Green Day', 45),
  si(1, 'Supermassive Black Hole', 'Muse', 41),
  si(1, 'Californication', 'Red Hot Chili Peppers', 39),
];

export const sidebarPopular20YearsSongs: SongArchiveSidebarItem[] = [
  si(1, 'Numb', 'Linkin Park', 52),
  si(1, 'Paralyzer', 'Finger Eleven', 52),
  si(1, 'In the End', 'Linkin Park', 48),
  si(1, 'Boulevard of Broken Dreams', 'Green Day', 45),
  si(1, 'Breath', 'Breaking Benjamin', 38),
];

export const sidebarPopular30YearsSongs: SongArchiveSidebarItem[] = [
  si(1, 'In the End', 'Linkin Park', 48),
  si(1, 'Boulevard of Broken Dreams', 'Green Day', 45),
  si(1, 'Supermassive Black Hole', 'Muse', 41),
  si(1, 'Californication', 'Red Hot Chili Peppers', 39),
  si(2, 'Through Glass', 'Stone Sour', 37),
];
