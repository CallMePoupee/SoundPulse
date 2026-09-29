import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import SiteFooter from '@/components/SiteFooter';
import SidebarPanel from '@/components/SidebarPanel';
import { performerProfileData } from '@/data/mockPerformerProfile';
import { performerPath } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: performerProfileData.name },
];

const discographyAlbums = [
  {
    coverClass: 'peepshow',
    title: 'Peepshow',
    label: 'Polydor / Geffen',
    year: '1988',
    run: 'SEP 10, 1988 – JAN 21, 1989',
    singles: '3',
    peak: '1',
    numberOnes: '1',
    weeks: '30',
    href: '/siouxsie-and-the-banshees/peepshow',
    rows: [
      ['Peek-a-Boo', '1', '1', '9', '13', '#10', 'Sep 10 – Dec 3, 1988', '/siouxsie-and-the-banshees/peepshow/peek-a-boo'],
      ['The Killing Jar', '2', '—', '9', '12', '#24', 'Oct 1 – Dec 17, 1988', '#'],
      ['The Last Beat of My Heart', '25', '—', '—', '5', '#29', 'Dec 24, 1988 – Jan 21, 1989', '#'],
    ],
  },
  {
    coverClass: 'superstition',
    title: 'Superstition',
    label: 'Polydor / Geffen',
    year: '1991',
    run: 'MAY 18 – NOV 16, 1991',
    singles: '2',
    peak: '1',
    numberOnes: '1',
    weeks: '25',
    href: '#',
    rows: [
      ['Kiss Them for Me', '1', '5', '13', '19', '#19', 'May 18 – Sep 21, 1991', '#'],
      ['Shadowtime', '13', '—', '—', '6', '#25', 'Oct 5 – Nov 16, 1991', '#'],
    ],
  },
  {
    coverClass: 'the-rapture',
    title: 'The Rapture',
    label: 'Polydor / Geffen',
    year: '1995',
    run: 'FEB 11 – APR 1, 1995',
    singles: '1',
    peak: '21',
    numberOnes: '0',
    weeks: '8',
    href: '#',
    rows: [
      ['O Baby', '21', '—', '—', '8', '#38', 'Feb 11 – Apr 1, 1995', '#'],
    ],
  },
];

export default function PerformerPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openAlbum, setOpenAlbum] = useState<string | null>('Peepshow');

  return (
    <>
      <SiteHeader
        activePath={performerPath(performerProfileData.name)}
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />

      <ChartBanner era="Performer Profile" bannerSrc={performerProfileData.bannerSrc} variant="song" />

      <main id="main-content">
        <h1 className="visually-hidden">{performerProfileData.name}</h1>

        <div className="shell">
          <section className="song-stat-section" aria-label="Performer Key Statistics">
            <div className="song-stat-grid">
              {performerProfileData.stats.map((stat) => (
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
            <section className="song-metadata performer-metadata" aria-label="Performer Metadata">
              <figure className="song-metadata__single-art performer-metadata__portrait">
                <img src={performerProfileData.profileArtSrc} alt={`${performerProfileData.name} profile artwork`} />
              </figure>
              <div className="song-metadata__copy">
                <div className="song-metadata__headline">
                  <span className="song-metadata__eyebrow">{performerProfileData.eyebrow}</span>
                  <h3 className="song-metadata__title">{performerProfileData.name}</h3>
                  <div className="song-metadata__artist">{performerProfileData.origin}</div>
                  <div className="song-metadata__genre">{performerProfileData.genre}</div>
                </div>
                <div className="song-metadata__details" aria-label="Performer details">
                  {performerProfileData.details.map((detail) => (
                    <div key={detail.label} className="song-metadata__detail">
                      <span>{detail.label}</span>
                      <strong>{detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="heading-performer-discography">
              <div className="section-head performer-discography-head">
                <h2 id="heading-performer-discography">Discography</h2>
                <span className="section-head-label">Chart Performance by Album</span>
              </div>

              <div className="performer-discography-archive" aria-label={`${performerProfileData.name} album chart archive`}>
                {discographyAlbums.map((album) => {
                  const isOpen = openAlbum === album.title;

                  return (
                    <article key={album.title} className={`performer-album-item${isOpen ? ' is-open' : ''}`}>
                      <div className="performer-album-item__summary">
                        <div className="performer-album-item__summary-main">
                          <span className={`performer-album-item__cover performer-album-item__cover--${album.coverClass}`} role="img" aria-label={`${album.title} artwork`} />
                          <div className="performer-album-item__identity">
                            <strong className="performer-album-item__title">
                              <a href={album.href} className="performer-album-item__link">{album.title}</a>
                            </strong>
                            <span className="performer-album-item__label">{album.label}</span>
                            <div className="performer-album-stat performer-album-stat--chart-run-inline">
                              <span className="performer-album-stat__label">Chart Run</span>
                              <strong className="performer-album-stat__value">{album.run}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="performer-album-item__stats-trailing">
                          <div className="performer-album-stat-stack performer-album-stat-stack--year">
                            <div className="performer-album-stat performer-album-stat--year">
                              <span className="performer-album-stat__label">Release<br />Year</span>
                              <strong className="performer-album-stat__value">{album.year}</strong>
                            </div>
                            <div className="performer-album-stat performer-album-stat--empty" />
                          </div>
                          <div className="performer-album-stat-stack">
                            <div className="performer-album-stat">
                              <span className="performer-album-stat__label">Charting<br />Singles</span>
                              <strong className="performer-album-stat__value">{album.singles}</strong>
                            </div>
                            <div className="performer-album-stat performer-album-stat--peak">
                              <span className="performer-album-stat__label">Peak<br />Position</span>
                              <strong className="performer-album-stat__value">{album.peak}</strong>
                            </div>
                          </div>
                          <div className="performer-album-stat-stack">
                            <div className="performer-album-stat">
                              <span className="performer-album-stat__label">Songs<br />Reaching #1</span>
                              <strong className="performer-album-stat__value">{album.numberOnes}</strong>
                            </div>
                            <div className="performer-album-stat">
                              <span className="performer-album-stat__label">Weeks<br />On Chart</span>
                              <strong className="performer-album-stat__value">{album.weeks}</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          className="performer-album-chevron-button"
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={`Toggle ${album.title} singles`}
                          onClick={() => setOpenAlbum(isOpen ? null : album.title)}
                        >
                          <span className="morph-chevron" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="performer-album-item__dropdown">
                        <div className="performer-album-item__body">
                          <div className="singles-header" aria-hidden="true">
                            <div className="singles-row-metrics">
                              <span className="single__header-title">Single</span>
                              <span>Peak<br />Position</span>
                              <span>Weeks<br />At #1</span>
                              <span>Weeks<br />In Top 10</span>
                              <span>Weeks<br />On Chart</span>
                              <span>Debut<br />Position</span>
                            </div>
                            <span className="singles-row-chart-run">Chart Run</span>
                            <span />
                          </div>
                          {album.rows.map(([singleTitle, rowPeak, weeksAtOne, weeksTopTen, rowWeeks, debut, rowRun, href]) => (
                            <div key={`${album.title}-${singleTitle}`} className="single">
                              <div className="singles-row-metrics">
                                <div className="single__identity">
                                  <strong className="single__title">
                                    <a href={href} className="single__link">{singleTitle}</a>
                                  </strong>
                                </div>
                                <span className={`single__metric${Number(rowPeak) <= 10 ? ' single__metric--peak' : ''}`}>{rowPeak}</span>
                                <span className={`single__metric${weeksAtOne === '—' ? ' single__metric--muted' : ''}`}>{weeksAtOne}</span>
                                <span className={`single__metric${weeksTopTen === '—' ? ' single__metric--muted' : ''}`}>{weeksTopTen}</span>
                                <span className="single__metric">{rowWeeks}</span>
                                <span className="single__metric single__metric--muted">{debut}</span>
                              </div>
                              <span className="single__run singles-row-chart-run">{rowRun}</span>
                              <span />
                            </div>
                          ))}
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
                {performerProfileData.honors.map((honor, index) => (
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

            <SidebarPanel headingId="albums-heading" heading={`Albums by ${performerProfileData.name}`} items={performerProfileData.albums} linkType="album" />
            <SidebarPanel headingId="songs-heading" heading={`Songs by ${performerProfileData.name}`} items={performerProfileData.songs} />
            <SidebarPanel headingId="related-heading" heading="Related Performers" items={performerProfileData.relatedPerformers} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
