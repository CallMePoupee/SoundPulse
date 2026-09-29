import type { PerformerProfileData } from '@/types/performerProfile';
import { albumBannerSrc, albumPath, honorBadgeSrc, performerPath, songPath } from '@/utils/slug';

export const performerProfileData: PerformerProfileData = {
  name: 'Siouxsie and the Banshees',
  genre: 'Post-Punk / Alternative Rock',
  activeYears: '1976–1996',
  origin: 'London, England',
  profileArtSrc: albumBannerSrc('Siouxsie and the Banshees', 'Peepshow'),
  bannerSrc: albumBannerSrc('Siouxsie and the Banshees', 'Peepshow'),
  eyebrow: 'Performer Profile',
  stats: [
    { label: 'Peak Position', value: '1', highlight: true },
    { label: '#1 Songs', value: '1' },
    { label: 'Top 10 Songs', value: '4' },
    { label: 'Charting Songs', value: '7' },
    { label: 'Weeks on Chart', value: '52' },
  ],
  details: [
    { label: 'Origin', value: 'London, England' },
    { label: 'Active Years', value: '1976–1996' },
    { label: 'Signature Album', value: 'Peepshow', href: albumPath('Siouxsie and the Banshees', 'Peepshow') },
  ],
  weeks: [
    { date: 'September 10, 1988', href: '/charts/1988-09-10', rank: 10, change: '—', changeType: 'muted', weeks: 1, isTop10: true, milestone: 'Performer chart debut' },
    { date: 'September 17, 1988', href: '/charts/1988-09-17', rank: 8, change: '+2', changeType: 'positive', weeks: 2, isTop10: true },
    { date: 'September 24, 1988', href: '/charts/1988-09-24', rank: 5, change: '+3', changeType: 'positive', weeks: 3, isTop10: true, milestone: 'Enters Top 5' },
    { date: 'October 1, 1988', href: '/charts/1988-10-01', rank: 3, change: '+2', changeType: 'positive', weeks: 4, isTop10: true },
    { date: 'October 8, 1988', href: '/charts/1988-10-08', rank: 1, change: '+2', changeType: 'positive', weeks: 5, isTop10: true, milestone: 'First #1 song' },
    { date: 'October 15, 1988', href: '/charts/1988-10-15', rank: 2, change: '-1', changeType: 'negative', weeks: 6, isTop10: true },
    { date: 'October 22, 1988', href: '/charts/1988-10-22', rank: 3, change: '-1', changeType: 'negative', weeks: 7, isTop10: true },
    { date: 'October 29, 1988', href: '/charts/1988-10-29', rank: 4, change: '-1', changeType: 'negative', weeks: 8, isTop10: true, milestone: 'Second top-five single overlaps' },
    { date: 'November 5, 1988', href: '/charts/1988-11-05', rank: 3, change: '+1', changeType: 'positive', weeks: 9, isTop10: true },
    { date: 'November 12, 1988', href: '/charts/1988-11-12', rank: 2, change: '+1', changeType: 'positive', weeks: 10, isTop10: true, milestone: 'Peak performer momentum' },
    { date: 'November 19, 1988', href: '/charts/1988-11-19', rank: 2, change: '—', changeType: 'muted', weeks: 11, isTop10: true },
    { date: 'November 26, 1988', href: '/charts/1988-11-26', rank: 4, change: '-2', changeType: 'negative', weeks: 12, isTop10: true },
    { date: 'December 3, 1988', href: '/charts/1988-12-03', rank: 7, change: '-3', changeType: 'negative', weeks: 13, isTop10: true },
  ],
  releases: [
    { title: 'Peepshow', type: 'Album', peak: 1, weeks: 16, href: albumPath('Siouxsie and the Banshees', 'Peepshow') },
    { title: 'Peek-a-Boo', type: 'Song', peak: 1, weeks: 13, href: songPath('Siouxsie and the Banshees', 'Peepshow', 'Peek-a-Boo') },
    { title: 'The Killing Jar', type: 'Song', peak: 2, weeks: 12, href: '#' },
    { title: 'Tinderbox', type: 'Album', peak: 2, weeks: 12, href: '#' },
  ],
  honors: [
    { badgeSrc: honorBadgeSrc('gold'), badgeAlt: 'Best performer gold honor badge', title: 'Performer Peak #1', description: 'Reached the summit with the Peepshow-era single “Peek-a-Boo”.' },
    { badgeSrc: honorBadgeSrc('silver'), badgeAlt: 'Legacy silver honor badge', title: 'Alternative Legacy Artist', description: 'A post-punk cornerstone with a lasting influence on gothic and alternative music.' },
    { badgeSrc: honorBadgeSrc('fifth'), badgeAlt: 'Year-end performer fifth place honor badge', title: 'Performer of the Year #5', description: 'One of the defining performers of the 1988 chart cycle.' },
  ],
  albums: [
    { peak: 1, title: 'Peepshow', performer: 'Siouxsie and the Banshees', metric: 16, metricLabel: 'WEEKS', href: albumPath('Siouxsie and the Banshees', 'Peepshow') },
    { peak: 2, title: 'Tinderbox', performer: 'Siouxsie and the Banshees', metric: 12, metricLabel: 'WEEKS', href: '#' },
    { peak: 3, title: 'Superstition', performer: 'Siouxsie and the Banshees', metric: 10, metricLabel: 'WEEKS', href: '#' },
  ],
  songs: [
    { peak: 1, title: 'Peek-a-Boo', performer: 'Siouxsie and the Banshees', metric: 13, metricLabel: 'WEEKS', href: songPath('Siouxsie and the Banshees', 'Peepshow', 'Peek-a-Boo') },
    { peak: 2, title: 'The Killing Jar', performer: 'Siouxsie and the Banshees', metric: 12, metricLabel: 'WEEKS', href: '#' },
    { peak: 5, title: 'Kiss Them for Me', performer: 'Siouxsie and the Banshees', metric: 12, metricLabel: 'WEEKS', href: '#' },
  ],
  relatedPerformers: [
    { peak: 1, title: 'The Cure', performer: 'The Cure', metric: 58, metricLabel: 'WEEKS', href: performerPath('The Cure') },
    { peak: 2, title: 'Echo & the Bunnymen', performer: 'Echo & the Bunnymen', metric: 41, metricLabel: 'WEEKS', href: performerPath('Echo & the Bunnymen') },
    { peak: 1, title: 'New Order', performer: 'New Order', metric: 49, metricLabel: 'WEEKS', href: performerPath('New Order') },
  ],
};
