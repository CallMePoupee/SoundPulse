import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import SiteFooter from '@/components/SiteFooter';
import SidebarPanel from '@/components/SidebarPanel';
import type { AlbumArchiveRow, AlbumSortKey } from '@/types/albumArchive';
import {
  albumArchiveRows,
  albumArchiveStats,
  albumDecadeOptions,
  albumGenreOptions,
  albumAlphabet,
  sidebarAlbumsOfMoment,
  sidebarPopular5YearsAlbums,
  sidebarPopular10YearsAlbums,
  sidebarPopular20YearsAlbums,
  sidebarPopular30YearsAlbums,
} from '@/data/mockAlbums';
import { pageBannerSrc } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Albums' },
];

const ALBUMS_PER_PAGE = 10;
const numericSortKeys = new Set<AlbumSortKey>(['peak', 'weeksOn', 'weeksAtOne', 'topTenWeeks', 'chartingSongs']);
const lowerIsBetterKeys = new Set<AlbumSortKey>(['peak']);

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getSortValue(row: AlbumArchiveRow, key: AlbumSortKey): string | number {
  switch (key) {
    case 'title': return row.title.toLowerCase();
    case 'peak': return row.peak;
    case 'weeksOn': return row.weeksOn;
    case 'weeksAtOne': return row.weeksAtOne;
    case 'topTenWeeks': return row.topTenWeeks;
    case 'chartingSongs': return row.chartingSongs;
    case 'date': return row.debutDate;
  }
}

export default function AlbumsPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDecades, setActiveDecades] = useState<Set<string>>(new Set());
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());
  const [activeLetters, setActiveLetters] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<AlbumSortKey>('title');
  const [sortDescending, setSortDescending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersAnimClass, setFiltersAnimClass] = useState('');
  const filtersDrawerRef = useRef<HTMLDivElement>(null);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const toggleDecade = (decade: string) => {
    setActiveDecades((prev) => toggleSet(prev, decade));
    setCurrentPage(1);
  };
  const toggleGenre = (genre: string) => {
    setActiveGenres((prev) => toggleSet(prev, genre));
    setCurrentPage(1);
  };
  const toggleLetter = (letter: string) => {
    setActiveLetters((prev) => toggleSet(prev, letter));
    setCurrentPage(1);
  };

  const handleSortClick = (key: AlbumSortKey) => {
    if (key === sortKey) {
      setSortDescending((prev) => !prev);
    } else {
      setSortKey(key);
      setSortDescending(false);
    }
    setCurrentPage(1);
  };

  const handleFiltersToggle = () => {
    const next = !filtersOpen;
    if (animTimer.current) clearTimeout(animTimer.current);
    setFiltersAnimClass(next ? 'is-opening' : 'is-closing');
    setFiltersOpen(next);
    animTimer.current = setTimeout(() => setFiltersAnimClass(''), 420);
  };

  const filteredRows = useMemo(() => {
    const matches = albumArchiveRows.filter((row) => {
      if (activeDecades.size > 0 && !activeDecades.has(row.decade)) return false;
      if (activeGenres.size > 0 && !row.genres.some((g) => activeGenres.has(g))) return false;
      if (activeLetters.size > 0) {
        const firstChar = row.title.trim().charAt(0).toUpperCase();
        const matchesLetter = Array.from(activeLetters).some((letter) =>
          letter === '#' ? !/^[A-Z]$/.test(firstChar) : firstChar === letter
        );
        if (!matchesLetter) return false;
      }
      return true;
    });

    const sorted = [...matches].sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      const multiplier = sortDescending ? -1 : 1;
      if (numericSortKeys.has(sortKey)) {
        const direction = lowerIsBetterKeys.has(sortKey) ? 1 : -1;
        const cmp = ((av as number) - (bv as number)) * direction * multiplier;
        return cmp || a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return cmp * multiplier || a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    return sorted;
  }, [activeDecades, activeGenres, activeLetters, sortKey, sortDescending]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ALBUMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageStart = (safePage - 1) * ALBUMS_PER_PAGE;
  const pageRows = filteredRows.slice(pageStart, pageStart + ALBUMS_PER_PAGE);

  const getPaginationItems = (page: number, total: number): (number | string)[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 'ellipsis-right', total - 1, total];
    if (page >= total - 2) return [1, 2, 'ellipsis-left', total - 3, total - 2, total - 1, total];
    return [1, 'ellipsis-left', page - 1, page, page + 1, 'ellipsis-right', total];
  };

  const paginationItems = getPaginationItems(safePage, totalPages);

  return (
    <>
      <SiteHeader
        activePath="/albums"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />
      <ChartBanner era="Albums Archive" bannerSrc={pageBannerSrc('albums')} />

      <main id="main-content">
        <h1 className="visually-hidden">Albums Archive</h1>

        <div className="shell">
          <section className="performer-stat-section" aria-label="Album Key Statistics">
            <div className="performer-stat-grid">
              {albumArchiveStats.map((stat) => (
                <div key={stat.label} className="performer-stat">
                  <span className="performer-stat__label">{stat.label}</span>
                  <span className={`performer-stat__value${stat.highlight ? ' highlight' : ''}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="shell content-area">
          <div className="main-column">
            <section aria-labelledby="heading-albums-archive">
              <div className="section-head">
                <h2 id="heading-albums-archive">Albums Archive</h2>
                <button
                  className={`section-head-label section-head-toggle order-toggle${filtersAnimClass ? ' ' + filtersAnimClass : ''}`}
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-pressed={filtersOpen}
                  aria-controls="albumsFiltersDrawer"
                  onClick={handleFiltersToggle}
                >
                  <span className="performance-toggle-label">
                    {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <span className="morph-chevron" aria-hidden="true" />
                </button>
              </div>

              <div className="performers-archive" aria-label="Albums chart archive">
                <div
                  className={`filters-drawer${filtersOpen ? ' is-open' : ''}`}
                  id="albumsFiltersDrawer"
                  aria-hidden={!filtersOpen}
                  ref={filtersDrawerRef}
                  style={filtersOpen ? { height: 'auto' } : { height: 0 }}
                >
                  <nav className="decade-filter" aria-label="Filter albums by decade">
                    <div className="decade-filter__options">
                      <span className="decade-filter__label">Decades</span>
                      {albumDecadeOptions.map((decade) => (
                        <a
                          key={decade}
                          href="#"
                          className={activeDecades.has(decade) ? 'is-active' : ''}
                          onClick={(e) => { e.preventDefault(); toggleDecade(decade); }}
                        >
                          {decade}
                        </a>
                      ))}
                    </div>
                  </nav>
                  <div className="genre-filter" aria-label="Filter albums by genre">
                    <span className="genre-filter__label">Genres</span>
                    <div className="genre-filter__options">
                      {albumGenreOptions.map((genre) => (
                        <a
                          key={genre}
                          href="#"
                          className={activeGenres.has(genre) ? 'is-active' : ''}
                          onClick={(e) => { e.preventDefault(); toggleGenre(genre); }}
                        >
                          {genre}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <nav className="alphabet-filter" aria-label="Filter albums by first character">
                  {albumAlphabet.map((letter) => (
                    <a
                      key={letter}
                      href="#"
                      className={activeLetters.has(letter) ? 'is-active' : ''}
                      onClick={(e) => { e.preventDefault(); toggleLetter(letter); }}
                    >
                      {letter}
                    </a>
                  ))}
                </nav>

                <div className="performers-header" role="row">
                  <div className="performers-row-metrics songs-row-metrics">
                    <button
                      type="button"
                      className={`performer-row__header-title performer-row__sort${sortKey === 'title' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'title' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('title')}
                    >
                      Album / Performer
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'peak' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'peak' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('peak')}
                    >
                      Peak<br />Position
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'weeksAtOne' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'weeksAtOne' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('weeksAtOne')}
                    >
                      Weeks<br />at #1
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'topTenWeeks' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'topTenWeeks' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('topTenWeeks')}
                    >
                      Top 10<br />Weeks
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'weeksOn' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'weeksOn' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('weeksOn')}
                    >
                      Weeks on<br />Chart
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'chartingSongs' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'chartingSongs' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('chartingSongs')}
                    >
                      Charting<br />Songs
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`performers-row-chart-run performer-row__sort${sortKey === 'date' ? ' is-active' : ''}`}
                    aria-sort={sortKey === 'date' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                    onClick={() => handleSortClick('date')}
                  >
                    Debut<br />Chart Date
                  </button>
                </div>

                {pageRows.map((row) => (
                  <a key={row.title + row.performer} href={row.href} className="performer-row">
                    <div className="performers-row-metrics songs-row-metrics">
                      <div className="performer-row__identity">
                        <img className="performer-row__cover" src={row.coverSrc} alt={row.title} />
                        <div className="performer-row__copy">
                          <strong className="performer-row__title">{row.title}</strong>
                          <span className="performer-row__artist">{row.performer}</span>
                        </div>
                      </div>
                      <span className={`performer-row__metric${row.peak === 1 ? ' performer-row__metric--peak' : ''}`}>{row.peak}</span>
                      <span className={`performer-row__metric${row.weeksAtOne === 0 ? ' performer-row__metric--muted' : ''}`}>
                        {row.weeksAtOne === 0 ? '—' : row.weeksAtOne}
                      </span>
                      <span className={`performer-row__metric${row.topTenWeeks === 0 ? ' performer-row__metric--muted' : ''}`}>
                        {row.topTenWeeks === 0 ? '—' : row.topTenWeeks}
                      </span>
                      <span className="performer-row__metric">{row.weeksOn}</span>
                      <span className="performer-row__metric">{row.chartingSongs}</span>
                    </div>
                    <span className="performer-row__run performers-row-chart-run">{formatDate(row.debutDate)}</span>
                  </a>
                ))}

                {totalPages > 1 && (
                  <nav className="performer-pagination" aria-label="Albums pagination">
                    <div className="pagination-desktop" role="group" aria-label="Pagination controls">
                      <button
                        className="pp-btn prev"
                        type="button"
                        aria-label="Previous page"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage(safePage - 1)}
                      >
                        <ChevronLeft size={14} aria-hidden="true" />
                      </button>
                      <div className="pagination-desktop__pages" role="presentation">
                        <div className="pagination-desktop__items">
                          {paginationItems.map((item, i) => {
                            if (typeof item !== 'number') {
                              return <span key={i} className="pp-ellipsis">...</span>;
                            }
                            const isActive = item === safePage;
                            return (
                              <button
                                key={i}
                                type="button"
                                className={`pp-btn pp-page${isActive ? ' is-active' : ''}`}
                                aria-label={isActive ? `Page ${item}, current page` : `Go to page ${item}`}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => setCurrentPage(item)}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        className="pp-btn next"
                        type="button"
                        aria-label="Next page"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage(safePage + 1)}
                      >
                        <ChevronRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="pagination-mobile" aria-label="Mobile pagination">
                      <button
                        className="pp-btn mobile-btn"
                        type="button"
                        aria-label="Previous page"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage(safePage - 1)}
                      >
                        <ChevronLeft size={14} aria-hidden="true" /> <span>Previous</span>
                      </button>
                      <div className="mobile-status" aria-live="polite" aria-label="Current page">
                        <span className="primary">{safePage}</span>
                        <span className="secondary">of</span>
                        <span className="primary">{totalPages}</span>
                      </div>
                      <button
                        className="pp-btn mobile-btn"
                        type="button"
                        aria-label="Next page"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage(safePage + 1)}
                      >
                        <span>Next</span> <ChevronRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </nav>
                )}
              </div>
            </section>
          </div>

          <aside className="sidebar" aria-label="Contextual Archives">
            <SidebarPanel headingId="moment-heading" heading="Albums of the Moment" items={sidebarAlbumsOfMoment} linkType="album" />
            <SidebarPanel headingId="popular-5-heading" heading="Popular 5 Years Ago" items={sidebarPopular5YearsAlbums} linkType="album" />
            <SidebarPanel headingId="popular-10-heading" heading="Popular 10 Years Ago" items={sidebarPopular10YearsAlbums} linkType="album" />
            <SidebarPanel headingId="popular-20-heading" heading="Popular 20 Years Ago" items={sidebarPopular20YearsAlbums} linkType="album" />
            <SidebarPanel headingId="popular-30-heading" heading="Popular 30 Years Ago" items={sidebarPopular30YearsAlbums} linkType="album" />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
