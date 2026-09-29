import type {
  AlbumArchiveStat,
  AlbumArchiveRow,
  AlbumArchiveSidebarItem,
} from '@/types/albumArchive';
import { albumPath, albumCoverSrc } from '@/utils/slug';

function a(
  title: string,
  performer: string,
  genres: string[],
  decade: string,
  peak: number,
  weeksOn: number,
  weeksAtOne: number,
  topTenWeeks: number,
  chartingSongs: number,
  debutDate: string,
): AlbumArchiveRow {
  return {
    title,
    performer,
    genres,
    decade,
    peak,
    weeksOn,
    weeksAtOne,
    topTenWeeks,
    chartingSongs,
    debutDate,
    coverSrc: albumCoverSrc(performer, title),
    href: albumPath(performer, title),
  };
}

export const albumArchiveStats: AlbumArchiveStat[] = [
  { label: 'Charting Albums', value: '1 286', highlight: true },
  { label: 'Multiple #1 Albums', value: '34' },
  { label: '#1 Albums', value: '147' },
  { label: 'Top 10 Albums', value: '412' },
  { label: 'One-Album Wonders', value: '89' },
];

export const albumArchiveRows: AlbumArchiveRow[] = [
  a('Hybrid Theory', 'Linkin Park', ['Alt. Rock', 'Nu Metal'], '2000s', 1, 52, 5, 22, 5, '2000-10-24'),
  a('Meteora', 'Linkin Park', ['Alt. Rock', 'Nu Metal'], '2000s', 1, 48, 4, 19, 4, '2003-04-01'),
  a('American Idiot', 'Green Day', ['Pop Punk', 'Alt. Rock'], '2000s', 1, 45, 3, 18, 4, '2004-09-21'),
  a('One-X', 'Three Days Grace', ['Post-Grunge', 'Alt. Rock'], '2000s', 1, 36, 3, 14, 3, '2006-06-13'),
  a('Phobia', 'Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 38, 2, 15, 3, '2006-08-08'),
  a('We Are Not Alone', 'Breaking Benjamin', ['Alt. Metal', 'Post-Grunge'], '2000s', 1, 37, 1, 14, 2, '2004-06-29'),
  a('Finding Beauty in Negative Spaces', 'Seether', ['Post-Grunge', 'Alt. Metal'], '2000s', 1, 32, 3, 13, 3, '2007-10-23'),
  a('The Sound of Madness', 'Shinedown', ['Hard Rock', 'Post-Grunge'], '2000s', 1, 34, 2, 16, 3, '2008-06-24'),
  a('Come What(ever) May', 'Stone Sour', ['Alt. Metal', 'Hard Rock'], '2000s', 2, 37, 0, 9, 2, '2006-08-01'),
  a('Them vs. You vs. Me', 'Finger Eleven', ['Alt. Rock', 'Post-Grunge'], '2000s', 1, 52, 4, 21, 2, '2007-03-06'),
  a('Black Holes and Revelations', 'Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 41, 2, 15, 3, '2006-07-11'),
  a('The Resistance', 'Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 39, 2, 14, 2, '2009-09-15'),
  a('Californication', 'Red Hot Chili Peppers', ['Alt. Rock', 'Funk Rock'], '1990s', 1, 39, 2, 16, 3, '1999-06-08'),
  a('Rites of Passage', 'Indigo Girls', ['Folk Pop', 'Americana'], '1990s', 10, 10, 0, 2, 1, '1992-05-12'),
  a('The Colour and the Shape', 'Foo Fighters', ['Alt. Rock', 'Post-Grunge'], '1990s', 1, 48, 7, 19, 4, '1997-05-20'),
  a('Dookie', 'Green Day', ['Pop Punk', 'Alt. Rock'], '1990s', 1, 45, 6, 17, 4, '1994-02-01'),
  a('Showbiz', 'Muse', ['Alt. Rock', 'Art Rock'], '1990s', 2, 28, 0, 8, 1, '1999-10-04'),
  a('Absolution', 'Muse', ['Alt. Rock', 'Art Rock'], '2000s', 1, 35, 1, 12, 2, '2003-09-22'),
  a('Disclaimer', 'Seether', ['Post-Grunge', 'Alt. Metal'], '2000s', 2, 28, 0, 8, 1, '2002-08-20'),
];

export const albumDecadeOptions = ['2020s', '2010s', '2000s', '1990s', '1980s'];

export const albumGenreOptions = [
  'Alt. Metal', 'Alt. Rock', 'Americana', 'Art Rock',
  'Folk Pop', 'Funk Rock', 'Hard Rock', 'Nu Metal',
  'Pop Punk', 'Post-Grunge', 'Post-Punk Rev.',
];

export const albumSortOptions: { key: import('@/types/albumArchive').AlbumSortKey; label: string }[] = [
  { key: 'title', label: 'A - Z' },
  { key: 'peak', label: 'Peak' },
  { key: 'weeksAtOne', label: '#1 Weeks' },
  { key: 'topTenWeeks', label: 'Top 10 Weeks' },
  { key: 'weeksOn', label: 'Weeks on Chart' },
  { key: 'chartingSongs', label: 'Charting Songs' },
];

export const albumAlphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function si(peak: number, title: string, performer: string, metric: number): AlbumArchiveSidebarItem {
  return { peak, title, performer, metric, metricLabel: 'WEEKS', href: albumPath(performer, title) };
}

export const sidebarAlbumsOfMoment: AlbumArchiveSidebarItem[] = [
  si(1, 'Hybrid Theory', 'Linkin Park', 52),
  si(1, 'Them vs. You vs. Me', 'Finger Eleven', 52),
  si(1, 'Meteora', 'Linkin Park', 48),
  si(1, 'American Idiot', 'Green Day', 45),
  si(1, 'Phobia', 'Breaking Benjamin', 38),
];

export const sidebarPopular5YearsAlbums: AlbumArchiveSidebarItem[] = [
  si(1, 'Them vs. You vs. Me', 'Finger Eleven', 52),
  si(1, 'The Sound of Madness', 'Shinedown', 34),
  si(1, 'Finding Beauty in Negative Spaces', 'Seether', 32),
  si(1, 'One-X', 'Three Days Grace', 36),
  si(1, 'Black Holes and Revelations', 'Muse', 41),
];

export const sidebarPopular10YearsAlbums: AlbumArchiveSidebarItem[] = [
  si(1, 'Hybrid Theory', 'Linkin Park', 52),
  si(1, 'Meteora', 'Linkin Park', 48),
  si(1, 'American Idiot', 'Green Day', 45),
  si(1, 'Black Holes and Revelations', 'Muse', 41),
  si(1, 'Californication', 'Red Hot Chili Peppers', 39),
];

export const sidebarPopular20YearsAlbums: AlbumArchiveSidebarItem[] = [
  si(1, 'Hybrid Theory', 'Linkin Park', 52),
  si(1, 'Them vs. You vs. Me', 'Finger Eleven', 52),
  si(1, 'Meteora', 'Linkin Park', 48),
  si(1, 'American Idiot', 'Green Day', 45),
  si(1, 'Phobia', 'Breaking Benjamin', 38),
];

export const sidebarPopular30YearsAlbums: AlbumArchiveSidebarItem[] = [
  si(1, 'The Colour and the Shape', 'Foo Fighters', 48),
  si(1, 'Dookie', 'Green Day', 45),
  si(1, 'Meteora', 'Linkin Park', 48),
  si(2, 'Showbiz', 'Muse', 28),
  si(2, 'Disclaimer', 'Seether', 28),
];
