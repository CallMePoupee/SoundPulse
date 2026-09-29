import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import ChartTable from '@/components/ChartTable';
import ChartEvents from '@/components/ChartEvents';
import SiteFooter from '@/components/SiteFooter';
import { weeklyChart } from '@/data/mockChart';
import type { ChartEvent } from '@/types/chart';
import { songPath, performerPath, chartBannerSrc } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Charts', href: '/charts' },
  { label: '1999', href: '/charts/1999' },
  { label: 'September 14, 1999' },
];

const chartEvents: ChartEvent[] = [
  {
    eventClass: 'chart-leader',
    badgeValue: '3',
    badgeLabel: 'Weeks\nat #1',
    label: 'Chart leader',
    copy: (
      <>
        <a href={songPath('Radiohead', 'OK Computer', 'Karma Police')} className="chart-event-link"><em>Karma Police</em></a> by{' '}
        <a href={performerPath('Radiohead')} className="chart-event-link">Radiohead</a> remains on top for a 3rd consecutive week.
      </>
    ),
  },
  {
    eventClass: 'prime-contender',
    badgeValue: '2',
    badgeLabel: 'Rank',
    label: 'Prime contender',
    copy: (
      <>
        Song most probable of taking #1 next:{' '}
        <a href={songPath('Foo Fighters', 'The Colour and the Shape', 'Everlong')} className="chart-event-link"><em>Everlong</em></a> by{' '}
        <a href={performerPath('Foo Fighters')} className="chart-event-link">Foo Fighters</a>.
      </>
    ),
  },
  {
    eventClass: 'biggest-climb',
    badgeValue: '5',
    badgeArrow: 'up',
    badgeLabel: 'Biggest Climb',
    label: 'On the rise',
    copy: (
      <>
        <a href={songPath('Radiohead', 'OK Computer', 'Paranoid Android')} className="chart-event-link"><em>Paranoid Android</em></a> by{' '}
        <a href={performerPath('Radiohead')} className="chart-event-link">Radiohead</a> rises 5 positions to register the week's biggest climb.
      </>
    ),
  },
  {
    eventClass: 'breakout-track',
    badgeValue: '18',
    badgeSuperscript: '+5',
    badgeLabel: 'Rank',
    label: 'Breakout track',
    copy: (
      <>
        Biggest rise for a song entering the top 20 or in its 2nd or 3rd chart week:{' '}
        <a href={songPath('Blink-182', 'Dude Ranch', 'Dammit')} className="chart-event-link"><em>Dammit</em></a> by{' '}
        <a href={performerPath('Blink-182')} className="chart-event-link">Blink-182</a>.
      </>
    ),
  },
  {
    eventClass: 'highest-debut',
    badgeValue: '10',
    badgeLabel: 'Highest Debut',
    label: 'Hot debut',
    copy: (
      <>
        <a href={songPath('Nine Inch Nails', 'Lost Highway', 'The Perfect Drug')} className="chart-event-link"><em>The Perfect Drug</em></a> by{' '}
        <a href={performerPath('Nine Inch Nails')} className="chart-event-link">Nine Inch Nails</a> enters at No. 10 as the highest debut of the week.
      </>
    ),
  },
  {
    eventClass: 'longest-run',
    badgeValue: '16',
    badgeLabel: 'Weeks\non Chart',
    label: 'Chart veteran',
    copy: (
      <>
        <a href={songPath('Foo Fighters', 'The Colour and the Shape', 'Monkey Wrench')} className="chart-event-link"><em>Monkey Wrench</em></a> by{' '}
        <a href={performerPath('Foo Fighters')} className="chart-event-link">Foo Fighters</a> reaches 16 weeks on the chart and holds the longest active run.
      </>
    ),
  },
  {
    eventClass: 'biggest-drop',
    badgeValue: '4',
    badgeArrow: 'down',
    badgeLabel: 'Biggest Drop',
    label: 'Rough week',
    copy: (
      <>
        <a href={songPath('The Verve Pipe', 'Villains', 'The Freshmen')} className="chart-event-link"><em>The Freshmen</em></a> by{' '}
        <a href={performerPath('The Verve Pipe')} className="chart-event-link">The Verve Pipe</a> falls 4 places for the biggest drop of the week.
      </>
    ),
  },
];

export default function WeeklyChartPage() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <SiteHeader
        activePath="/charts/1999/week-of-september-14"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />
      <main id="main-content">
        <h1 className="visually-hidden">
          {weeklyChart.eraLabel} — {weeklyChart.weekDate}
        </h1>
        <ChartBanner era={weeklyChart.eraLabel} bannerSrc={chartBannerSrc('modern-rock-tracks')} />
        <div className="shell chart-page-section">
          <div className="chart-page-grid">
            <div className="chart-page-main">
              <ChartTable chart={weeklyChart} />
            </div>
            <ChartEvents events={chartEvents} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
