import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChartBanner from '@/components/ChartBanner';
import SiteFooter from '@/components/SiteFooter';
import SidebarPanel from '@/components/SidebarPanel';
import type { PerformerRow, SortKey } from '@/types/performer';
import {
  performers,
  performerStats,
  decadeOptions,
  genreOptions,
  alphabet,
  sidebarPerformersOfMoment,
  sidebarPopular5Years,
  sidebarPopular10Years,
  sidebarPopular20Years,
  sidebarPopular30Years,
} from '@/data/mockPerformers';
import { chartBannerSrc } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Performers' },
];

const PERFORMERS_PER_PAGE = 10;
const numericSortKeys = new Set<SortKey>(['peak', 'numberOnes', 'topTen', 'chartingSongs', 'weeks']);
const lowerIsBetterKeys = new Set<SortKey>(['peak']);

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getSortValue(row: PerformerRow, key: SortKey): string | number {
  switch (key) {
    case 'name': return row.name.toLowerCase();
    case 'peak': return row.peak;
    case 'numberOnes': return row.numberOnes;
    case 'topTen': return row.topTen;
    case 'chartingSongs': return row.chartingSongs;
    case 'weeks': return row.weeks;
    case 'date': return row.debutDate;
  }
}

export default function PerformersPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDecades, setActiveDecades] = useState<Set<string>>(new Set());
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());
  const [activeLetters, setActiveLetters] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('name');
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

  const handleSortClick = (key: SortKey) => {
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
    const matches = performers.filter((row) => {
      if (activeDecades.size > 0 && !activeDecades.has(row.decade)) return false;
      if (activeGenres.size > 0 && !row.genres.some((g) => activeGenres.has(g))) return false;
      if (activeLetters.size > 0) {
        const firstChar = row.name.trim().charAt(0).toUpperCase();
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
        return cmp || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return cmp * multiplier || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    return sorted;
  }, [activeDecades, activeGenres, activeLetters, sortKey, sortDescending]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PERFORMERS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageStart = (safePage - 1) * PERFORMERS_PER_PAGE;
  const pageRows = filteredRows.slice(pageStart, pageStart + PERFORMERS_PER_PAGE);

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
        activePath="/performers"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />
      <ChartBanner era="Performers Archive" bannerSrc={chartBannerSrc('performers')} />

      <main id="main-content">
        <h1 className="visually-hidden">Performers Archive</h1>

        <div className="shell">
          <section className="performer-stat-section" aria-label="Performer Key Statistics">
            <div className="performer-stat-grid">
              {performerStats.map((stat) => (
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
            <section aria-labelledby="heading-performers-archive">
              <div className="section-head">
                <h2 id="heading-performers-archive">Performers Archive</h2>
                <button
                  className={`section-head-label section-head-toggle order-toggle${filtersAnimClass ? ' ' + filtersAnimClass : ''}`}
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-pressed={filtersOpen}
                  aria-controls="performersFiltersDrawer"
                  onClick={handleFiltersToggle}
                >
                  <span className="performance-toggle-label">
                    {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <span className="morph-chevron" aria-hidden="true" />
                </button>
              </div>

              <div className="performers-archive" aria-label="Performers chart archive">
                <div
                  className={`filters-drawer${filtersOpen ? ' is-open' : ''}`}
                  id="performersFiltersDrawer"
                  aria-hidden={!filtersOpen}
                  ref={filtersDrawerRef}
                  style={filtersOpen ? { height: 'auto' } : { height: 0 }}
                >
                  <nav className="decade-filter" aria-label="Filter performers by decade">
                    <div className="decade-filter__options">
                      <span className="decade-filter__label">Decades</span>
                      {decadeOptions.map((decade) => (
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
                  <div className="genre-filter" aria-label="Filter performers by genre">
                    <span className="genre-filter__label">Genres</span>
                    <div className="genre-filter__options">
                      {genreOptions.map((genre) => (
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

                <nav className="alphabet-filter" aria-label="Filter performers by first character">
                  {alphabet.map((letter) => (
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
                  <div className="performers-row-metrics">
                    <button
                      type="button"
                      className={`performer-row__header-title performer-row__sort${sortKey === 'name' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'name' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('name')}
                    >
                      Performer / Genre
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
                      className={`performer-row__sort${sortKey === 'numberOnes' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'numberOnes' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('numberOnes')}
                    >
                      #1<br />Songs
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'topTen' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'topTen' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('topTen')}
                    >
                      Top 10<br />Songs
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'chartingSongs' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'chartingSongs' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('chartingSongs')}
                    >
                      Charting<br />Songs
                    </button>
                    <button
                      type="button"
                      className={`performer-row__sort${sortKey === 'weeks' ? ' is-active' : ''}`}
                      aria-sort={sortKey === 'weeks' ? (sortDescending ? 'descending' : 'ascending') : 'none'}
                      onClick={() => handleSortClick('weeks')}
                    >
                      Weeks on<br />Chart
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
                  <a key={row.name} href={row.href} className="performer-row">
                    <div className="performers-row-metrics">
                      <div className="performer-row__identity">
                        <img className="performer-row__cover" src={row.coverSrc} alt={row.name} />
                        <div className="performer-row__copy">
                          <strong className="performer-row__title">{row.name}</strong>
                          <span className="performer-row__artist">{row.genres.join(' / ')}</span>
                        </div>
                      </div>
                      <span className={`performer-row__metric${row.peak === 1 ? ' performer-row__metric--peak' : ''}`}>{row.peak}</span>
                      <span className={`performer-row__metric${row.numberOnes === 0 ? ' performer-row__metric--muted' : ''}`}>
                        {row.numberOnes === 0 ? '—' : row.numberOnes}
                      </span>
                      <span className={`performer-row__metric${row.topTen === 0 ? ' performer-row__metric--muted' : ''}`}>
                        {row.topTen === 0 ? '—' : row.topTen}
                      </span>
                      <span className="performer-row__metric">{row.chartingSongs}</span>
                      <span className="performer-row__metric">{row.weeks}</span>
                    </div>
                    <span className="performer-row__run performers-row-chart-run">{formatDate(row.debutDate)}</span>
                  </a>
                ))}

                {totalPages > 1 && (
                  <nav className="performer-pagination" aria-label="Performer pagination">
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
            <SidebarPanel headingId="moment-heading" heading="Performers of the Moment" items={sidebarPerformersOfMoment} linkType="album" />
            <SidebarPanel headingId="popular-5-heading" heading="Popular 5 Years Ago" items={sidebarPopular5Years} linkType="album" />
            <SidebarPanel headingId="popular-10-heading" heading="Popular 10 Years Ago" items={sidebarPopular10Years} linkType="album" />
            <SidebarPanel headingId="popular-20-heading" heading="Popular 20 Years Ago" items={sidebarPopular20Years} linkType="album" />
            <SidebarPanel headingId="popular-30-heading" heading="Popular 30 Years Ago" items={sidebarPopular30Years} linkType="album" />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
