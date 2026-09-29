import type { VersusCategory, VersusCompetitor, VersusCriterion } from '@/types/versus';
import { songArchiveRows } from '@/data/mockSongs';
import { albumArchiveRows } from '@/data/mockAlbums';
import { performers } from '@/data/mockPerformers';
import { songCoverSrc, albumCoverSrc, performerCoverSrc, songPath, albumPath, performerPath, slugify } from '@/utils/slug';

export const SONG_CRITERIA: VersusCriterion[] = [
  { key: 'peak', label: 'Peak Position', description: 'Highest chart position reached — lower is better.', lowerIsBetter: true },
  { key: 'weeksAtOne', label: 'Weeks at No. 1', description: 'Total weeks spent at the top of the chart.', lowerIsBetter: false },
  { key: 'topTenWeeks', label: 'Top 10 Weeks', description: 'Weeks spent inside the top 10.', lowerIsBetter: false },
  { key: 'weeksOn', label: 'Weeks on Chart', description: 'Total chart run longevity.', lowerIsBetter: false },
  { key: 'debutPosition', label: 'Debut Position', description: 'Position upon first entering the chart — lower is better.', lowerIsBetter: true },
];

export const ALBUM_CRITERIA: VersusCriterion[] = [
  { key: 'peak', label: 'Peak Position', description: 'Highest chart position reached — lower is better.', lowerIsBetter: true },
  { key: 'weeksAtOne', label: 'Weeks at No. 1', description: 'Total weeks spent at the top of the chart.', lowerIsBetter: false },
  { key: 'topTenWeeks', label: 'Top 10 Weeks', description: 'Weeks spent inside the top 10.', lowerIsBetter: false },
  { key: 'weeksOn', label: 'Weeks on Chart', description: 'Total chart run longevity.', lowerIsBetter: false },
  { key: 'chartingSongs', label: 'Charting Songs', description: 'Number of singles from the album that charted.', lowerIsBetter: false },
];

export const PERFORMER_CRITERIA: VersusCriterion[] = [
  { key: 'peak', label: 'Peak Position', description: 'Highest chart position reached — lower is better.', lowerIsBetter: true },
  { key: 'numberOnes', label: 'No. 1 Songs', description: 'Total songs that reached No. 1.', lowerIsBetter: false },
  { key: 'topTen', label: 'Top 10 Songs', description: 'Total songs that entered the top 10.', lowerIsBetter: false },
  { key: 'chartingSongs', label: 'Charting Songs', description: 'Total songs that have charted.', lowerIsBetter: false },
  { key: 'weeks', label: 'Weeks on Chart', description: 'Cumulative chart weeks across all songs.', lowerIsBetter: false },
];

export function getCriteria(category: VersusCategory): VersusCriterion[] {
  switch (category) {
    case 'songs': return SONG_CRITERIA;
    case 'albums': return ALBUM_CRITERIA;
    case 'performers': return PERFORMER_CRITERIA;
  }
}

export function getCompetitors(category: VersusCategory): VersusCompetitor[] {
  switch (category) {
    case 'songs':
      return songArchiveRows.map((row) => ({
        id: slugify(`${row.performer}-${row.title}`),
        title: row.title,
        subtitle: row.performer,
        coverSrc: songCoverSrc(row.performer, 'singles', row.title),
        href: songPath(row.performer, 'singles', row.title),
        metrics: {
          peak: row.peak,
          weeksAtOne: row.weeksAtOne,
          topTenWeeks: row.topTenWeeks,
          weeksOn: row.weeksOn,
          debutPosition: row.debutPosition,
        },
      }));
    case 'albums':
      return albumArchiveRows.map((row) => ({
        id: slugify(`${row.performer}-${row.title}`),
        title: row.title,
        subtitle: row.performer,
        coverSrc: albumCoverSrc(row.performer, row.title),
        href: albumPath(row.performer, row.title),
        metrics: {
          peak: row.peak,
          weeksAtOne: row.weeksAtOne,
          topTenWeeks: row.topTenWeeks,
          weeksOn: row.weeksOn,
          chartingSongs: row.chartingSongs,
        },
      }));
    case 'performers':
      return performers.map((row) => ({
        id: slugify(row.name),
        title: row.name,
        subtitle: row.genres.join(' / '),
        coverSrc: performerCoverSrc(row.name),
        href: performerPath(row.name),
        metrics: {
          peak: row.peak,
          numberOnes: row.numberOnes,
          topTen: row.topTen,
          chartingSongs: row.chartingSongs,
          weeks: row.weeks,
        },
      }));
  }
}

export const CATEGORY_LABELS: Record<VersusCategory, string> = {
  songs: 'Songs',
  albums: 'Albums',
  performers: 'Performers',
};
