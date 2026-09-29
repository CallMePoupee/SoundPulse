import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import SiteFooter from '@/components/SiteFooter';
import SidebarPanel from '@/components/SidebarPanel';
import { albumData } from '@/data/mockAlbum';
import { albumBannerSrc, albumPath, performerPath } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: albumData.artist, href: performerPath(albumData.artist) },
  { label: albumData.title },
];

const singleRuns = [
  {
    coverClass: 'peek-a-boo',
    title: 'Peek-a-Boo',
    peak: '1',
    run: 'SEP 10 – DEC 3, 1988',
    weeksAtOne: '1',
    weeksTop10: '9',
    weeks: '13',
    debut: '10',
    href: '/siouxsie-and-the-banshees/peepshow/peek-a-boo',
    rows: [
      ['September 10, 1988', '10', '—', '1', 'Enters Top 10'],
      ['September 17, 1988', '8', '10', '2', ''],
      ['September 24, 1988', '5', '8', '3', 'Enters Top 5'],
      ['October 1, 1988', '3', '5', '4', ''],
      ['October 8, 1988', '1', '3', '5', 'Reaches #1'],
      ['October 15, 1988', '2', '1', '6', ''],
      ['October 22, 1988', '3', '2', '7', ''],
      ['October 29, 1988', '6', '3', '8', ''],
      ['November 5, 1988', '9', '6', '9', ''],
      ['November 12, 1988', '13', '9', '10', 'Leaves Top 10'],
      ['November 19, 1988', '18', '13', '11', ''],
      ['November 26, 1988', '24', '18', '12', ''],
      ['December 3, 1988', '28', '24', '13', 'Final Chart Week'],
    ],
  },
  {
    coverClass: 'the-killing-jar',
    title: 'The Killing Jar',
    peak: '2',
    run: 'OCT 1 – DEC 17, 1988',
    weeksAtOne: '0',
    weeksTop10: '9',
    weeks: '12',
    debut: '24',
    href: '#',
    rows: [
      ['October 1, 1988', '24', '—', '1', 'Chart Debut'],
      ['October 8, 1988', '18', '24', '2', 'Enters Top 20'],
      ['October 15, 1988', '12', '18', '3', ''],
      ['October 22, 1988', '7', '12', '4', 'Enters Top 10'],
      ['October 29, 1988', '4', '7', '5', 'Enters Top 5'],
      ['November 5, 1988', '3', '4', '6', ''],
      ['November 12, 1988', '2', '3', '7', 'Peaks at #2'],
      ['November 19, 1988', '2', '2', '8', ''],
      ['November 26, 1988', '4', '2', '9', ''],
      ['December 3, 1988', '7', '4', '10', ''],
      ['December 10, 1988', '9', '7', '11', ''],
      ['December 17, 1988', '15', '9', '12', 'Final Chart Week'],
    ],
  },
  {
    coverClass: 'the-last-beat-of-my-heart',
    title: 'The Last Beat of My Heart',
    peak: '25',
    run: 'DEC 24, 1988 – JAN 21, 1989',
    weeksAtOne: '0',
    weeksTop10: '0',
    weeks: '5',
    debut: '29',
    href: '#',
    rows: [
      ['December 24, 1988', '29', '—', '1', 'Chart Debut'],
      ['December 31, 1988', '27', '29', '2', ''],
      ['January 7, 1989', '25', '27', '3', 'Peaks at #25'],
      ['January 14, 1989', '26', '25', '4', ''],
      ['January 21, 1989', '30', '26', '5', 'Final Chart Week'],
    ],
  },
];

function getMovement(previous: string, rank: string) {
  if (previous === '—') return { label: '—', className: 'muted' };
  const movement = Number(previous) - Number(rank);
  return {
    label: `${movement > 0 ? '+' : ''}${movement}`,
    className: movement > 0 ? 'positive' : movement < 0 ? 'negative' : 'muted',
  };
}

export default function AlbumPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSingle, setOpenSingle] = useState<string | null>(null);

  return (
    <>
      <SiteHeader
        activePath={albumPath(albumData.artist, albumData.title)}
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />

      <ChartBanner era="Album Profile" bannerSrc={albumBannerSrc(albumData.artist, albumData.title)} variant="song" />

      <main id="main-content">
        <h1 className="visually-hidden">{albumData.title} — {albumData.artist}</h1>

        <div className="shell">
          <section className="song-stat-section" aria-label="Album Key Statistics">
            <div className="song-stat-grid">
              {albumData.stats.map((stat) => (
                <div key={stat.label} className="song-stat">
                  <span className="song-stat__label">{stat.label}</span>
                  <span className={`song-stat__value${stat.highlight ? ' highlight' : ''}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="shell content-area">
          <div className="main-column">
            <section className="song-metadata album-metadata" aria-label="Album Metadata">
              <figure className="song-metadata__single-art album-metadata__cover">
                <img src={albumData.albumArtSrc} alt={`${albumData.title} album artwork`} />
              </figure>
              <div className="song-metadata__copy">
                <div className="song-metadata__headline">
                  <span className="song-metadata__eyebrow">{albumData.eyebrow}</span>
                  <h3 className="song-metadata__title">{albumData.title}</h3>
                  <div className="song-metadata__artist">
                    <a href={performerPath(albumData.artist)}>{albumData.artist}</a>
                  </div>
                  <div className="song-metadata__genre">{albumData.genre}</div>
                </div>
                <div className="song-metadata__details" aria-label="Release details">
                  {albumData.details.map((detail) => (
                    <div key={detail.label} className="song-metadata__detail">
                      <span>{detail.label}</span>
                      <strong>{detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="heading-chart-performance">
              <div className="section-head album-singles-head">
                <h2 id="heading-chart-performance">Chart Performance</h2>
                <span className="section-head-label">Billboard Modern Rock Tracks</span>
              </div>

              <div className="album-singles-archive" aria-label={`${albumData.title} singles chart archive`}>
                {singleRuns.map((single) => {
                  const isOpen = openSingle === single.title;

                  return (
                    <article key={single.title} className={`album-single-item${isOpen ? ' is-open' : ''}`}>
                      <div className="album-single-item__summary">
                        <div className="album-single-item__summary-main">
                          <span className={`album-single-item__cover album-single-item__cover--${single.coverClass}`} role="img" aria-label={`${single.title} artwork`} />
                          <div className="album-single-item__identity">
                            <strong className="album-single-item__title">
                              <a href={single.href} className="album-single-item__link">{single.title}</a>
                            </strong>
                            <span className="album-single-item__label">
                              <a href={performerPath(albumData.artist)}>{albumData.artist}</a>
                            </span>
                            <div className="album-single-stat album-single-stat--chart-run">
                              <span className="album-single-stat__label">Chart Run</span>
                              <strong className="album-single-stat__value">{single.run}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="album-single-item__stats-trailing">
                          <div className="album-single-stat-stack album-single-stat-stack--peak">
                            <div className="album-single-stat album-single-stat--peak-metric">
                              <span className="album-single-stat__label">Peak<br />Position</span>
                              <strong className="album-single-stat__value">{single.peak}</strong>
                            </div>
                            <div className="album-single-stat album-single-stat--empty" />
                          </div>
                          <div className="album-single-stat-stack">
                            <div className="album-single-stat">
                              <span className="album-single-stat__label">Weeks<br />at No. 1</span>
                              <strong className="album-single-stat__value">{single.weeksAtOne}</strong>
                            </div>
                            <div className="album-single-stat">
                              <span className="album-single-stat__label">Weeks<br />in Top 10</span>
                              <strong className="album-single-stat__value">{single.weeksTop10}</strong>
                            </div>
                          </div>
                          <div className="album-single-stat-stack">
                            <div className="album-single-stat">
                              <span className="album-single-stat__label">Weeks<br />on Chart</span>
                              <strong className="album-single-stat__value">{single.weeks}</strong>
                            </div>
                            <div className="album-single-stat">
                              <span className="album-single-stat__label">Debut<br />Position</span>
                              <strong className="album-single-stat__value">{single.debut}</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          className="album-single-chevron-button"
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={`Toggle ${single.title} chart history`}
                          onClick={() => setOpenSingle(isOpen ? null : single.title)}
                        >
                          <span className="morph-chevron" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="album-single-item__dropdown">
                        <div className="album-single-item__body">
                          <div className="album-single-weeks-header" aria-hidden="true">
                            <div className="album-single-weeks-row-metrics">
                              <span className="album-single-week-entry__header-title">Chart Date</span>
                              <span>Rank</span>
                              <span>+/-</span>
                              <span>Weeks</span>
                            </div>
                            <span className="album-single-weeks-row-milestones">Milestone</span>
                            <span />
                          </div>
                          {single.rows.map(([date, rank, previous, weeks, milestone]) => {
                            const movement = getMovement(previous, rank);
                            const top10Class = Number(rank) <= 10 ? ' album-single-week-entry__metric--top10' : '';

                            return (
                              <a key={`${single.title}-${date}`} href="#" className="album-single-week-entry">
                                <div className="album-single-weeks-row-metrics">
                                  <span className="album-single-week-entry__date">{date}</span>
                                  <span className={`album-single-week-entry__metric album-single-week-entry__metric--rank${top10Class}`}>{rank}</span>
                                  <span className={`album-single-week-entry__metric album-single-week-entry__metric--change album-single-week-entry__metric--${movement.className}`}>{movement.label}</span>
                                  <span className="album-single-week-entry__metric album-single-week-entry__metric--weeks">{weeks}</span>
                                </div>
                                <span className="album-single-week-entry__milestone album-single-weeks-row-milestones">{milestone}</span>
                                <span />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="sidebar" aria-label="Contextual Archives">
            <section className="panel" aria-labelledby="honors-heading">
              <h3 id="honors-heading">Honors</h3>
              <div className="honors-list">
                {albumData.honors.map((honor, index) => (
                  <div key={index} className="honor-item">
                    <div className="honor-item__badge">
                      <img src={honor.badgeSrc} alt={honor.badgeAlt} />
                    </div>
                    <div className="honor-item__copy">
                      <strong>{honor.title}</strong>
                      <span>{honor.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <SidebarPanel headingId="albums-heading" heading={`Albums by ${albumData.artist}`} items={albumData.albumsByArtist} linkType="album" />
            <SidebarPanel headingId="songs-album-heading" heading={`Songs from ${albumData.title}`} items={albumData.songsFromAlbum} />
            <SidebarPanel headingId="related-heading" heading="Related Albums" items={albumData.relatedAlbums} linkType="album" />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
