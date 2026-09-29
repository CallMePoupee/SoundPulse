import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import SiteFooter from '@/components/SiteFooter';
import SidebarPanel from '@/components/SidebarPanel';
import RankingChart from '@/components/RankingChart';
import { songData } from '@/data/mockSong';
import { songPath, performerPath, albumPath, songBannerSrc } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: songData.artist, href: performerPath(songData.artist) },
  { label: songData.album, href: albumPath(songData.artist, songData.album) },
  { label: songData.title },
];

export default function SongPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [graphVisible, setGraphVisible] = useState(false);

  const handleToggle = () => {
    setGraphVisible(!graphVisible);
  };

  return (
    <>
      <SiteHeader
        activePath={songPath(songData.artist, songData.album, songData.title)}
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />

      <ChartBanner era="Song Profile" bannerSrc={songBannerSrc(songData.artist, songData.album, songData.title)} variant="song" />

      <main id="main-content">
        <h1 className="visually-hidden">{songData.title} — {songData.artist}</h1>

        {/* SONG STATS */}
        <div className="shell">
          <section className="song-stat-section" aria-label="Song Key Statistics">
            <div className="song-stat-grid">
              {songData.stats.map((stat) => (
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

        {/* CONTENT + SIDEBAR */}
        <div className="shell content-area">
          <div className="main-column">
            {/* Song Metadata */}
            <section className="song-metadata" aria-label="Song Metadata">
              <figure className="song-metadata__single-art">
                <img src={songData.singleArtSrc} alt={`${songData.title} single cover`} />
              </figure>
              <div className="song-metadata__copy">
                <div className="song-metadata__headline">
                  <span className="song-metadata__eyebrow">Song Profile</span>
                  <h3 className="song-metadata__title">{songData.title}</h3>
                  <div className="song-metadata__artist">
                    <a href={performerPath(songData.artist)}>{songData.artist}</a>
                  </div>
                  <div className="song-metadata__genre">{songData.genre}</div>
                </div>
                <div className="song-metadata__details" aria-label="Release details">
                  {songData.details.map((detail) => (
                    <div key={detail.label} className="song-metadata__detail">
                      <span>{detail.label}</span>
                      <strong>
                        {detail.label === 'Album'
                      ? <a href={albumPath(songData.artist, detail.value)}>{detail.value}</a>
                      : detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Chart Performance / Week-by-Week */}
            <section aria-labelledby="heading-run-history">
              <div className="section-head">
                <h2 id="heading-run-history">Chart Performance</h2>
                <button
                  className="section-head-label section-head-toggle order-toggle"
                  type="button"
                  aria-expanded={graphVisible}
                  aria-pressed={graphVisible}
                  aria-controls="performanceGraphPanel"
                  onClick={handleToggle}
                >
                  <span className="performance-toggle-label">
                    {graphVisible ? 'Hide performance graph' : 'Reveal performance graph'}
                  </span>
                  <span className="morph-chevron" aria-hidden="true" />
                </button>
              </div>
              <div className="chart-performance-layout">
                <div
                  className={`performance-chart-panel${graphVisible ? ' is-visible' : ''}`}
                  id="performanceGraphPanel"
                  hidden={!graphVisible}
                >
                  <div className="modern-chart" aria-label="Chart Run">
                    <RankingChart data={songData.weeks} title={`${songData.title} chart run`} />
                  </div>
                </div>
                <div className="weeks-container">
                  <div className="weeks-header" aria-hidden="true">
                    <div className="weeks-row-metrics">
                      <span className="week-entry__header-title">Chart Date</span>
                      <span>Rank</span>
                      <span>Change</span>
                      <span>Weeks</span>
                    </div>
                    <span className="weeks-row-milestones">Milestone</span>
                  </div>
                  {songData.weeks.map((week) => (
                    <a key={week.href} href={week.href} className="week-entry">
                      <div className="weeks-row-metrics">
                        <span className="week-entry__date">{week.date}</span>
                        <span className={`week-entry__metric week-entry__metric--rank${week.isTop10 ? ' week-entry__metric--top10' : ''}`}>
                          {week.rank}
                        </span>
                        <span className={`week-entry__metric week-entry__metric--change week-entry__metric--${week.changeType}`}>
                          {week.changeType === 'positive' && <ArrowUp size={12} aria-hidden />}
                          {week.changeType === 'negative' && <ArrowDown size={12} aria-hidden />}
                          {week.change.replace(/^[+-]/, '')}
                        </span>
                        <span className="week-entry__metric week-entry__metric--weeks">{week.weeks}</span>
                      </div>
                      <span className="week-entry__milestone weeks-row-milestones">{week.milestone ?? ''}</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sidebar" aria-label="Contextual Archives">
            <section className="panel" aria-labelledby="honors-heading">
              <h3 id="honors-heading">Honors</h3>
              <div className="honors-list">
                {songData.honors.map((honor, index) => (
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

            <SidebarPanel headingId="albums-heading" heading={`Albums by ${songData.artist}`} items={songData.albumsByArtist} linkType="album" />
            <SidebarPanel headingId="songs-artist-heading" heading={`Songs by ${songData.artist}`} items={songData.songsByArtist} />
            <SidebarPanel headingId="related-heading" heading="Related Songs" items={songData.relatedSongs} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
