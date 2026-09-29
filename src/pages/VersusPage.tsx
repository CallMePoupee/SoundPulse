import { useMemo, useState } from 'react';
import { Swords, Search, X, Trophy, Minus, ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SearchPanel from '@/components/SearchPanel';
import Breadcrumbs from '@/components/Breadcrumbs';
import SiteFooter from '@/components/SiteFooter';
import type { VersusCategory, VersusCompetitor, VersusOutcome, CriterionResult } from '@/types/versus';
import { getCompetitors, getCriteria, CATEGORY_LABELS } from '@/data/versusData';
import { pageBannerSrc } from '@/utils/slug';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Versus' },
];

const CATEGORIES: VersusCategory[] = ['songs', 'albums', 'performers'];

function compareCriterion(
  a: number | string,
  b: number | string,
  lowerIsBetter: boolean,
): 'a' | 'b' | 'tie' {
  const na = typeof a === 'number' ? a : parseFloat(a);
  const nb = typeof b === 'number' ? b : parseFloat(b);
  if (na === nb) return 'tie';
  if (lowerIsBetter) return na < nb ? 'a' : 'b';
  return na > nb ? 'a' : 'b';
}

function computeOutcome(a: VersusCompetitor, b: VersusCompetitor, criteria: ReturnType<typeof getCriteria>): VersusOutcome {
  const results: CriterionResult[] = criteria.map((c) => {
    const va = a.metrics[c.key];
    const vb = b.metrics[c.key];
    const winner = compareCriterion(va, vb, c.lowerIsBetter);
    const na = typeof va === 'number' ? va : parseFloat(va);
    const nb = typeof vb === 'number' ? vb : parseFloat(vb);
    const total = na + nb;
    let shareA: number;
    let shareB: number;
    if (c.lowerIsBetter) {
      const invA = total === 0 ? 0 : total - na;
      const invB = total === 0 ? 0 : total - nb;
      const invTotal = invA + invB || 1;
      shareA = invTotal === 0 ? 0.5 : invA / invTotal;
      shareB = invTotal === 0 ? 0.5 : invB / invTotal;
    } else {
      shareA = total === 0 ? 0.5 : na / total;
      shareB = total === 0 ? 0.5 : nb / total;
    }
    return {
      key: c.key,
      label: c.label,
      description: c.description,
      a: va,
      b: vb,
      winner,
      displayA: String(va),
      displayB: String(vb),
      shareA,
      shareB,
    };
  });

  const scoreA = results.filter((r) => r.winner === 'a').length;
  const scoreB = results.filter((r) => r.winner === 'b').length;
  const winner = scoreA === scoreB ? 'tie' : scoreA > scoreB ? 'a' : 'b';

  return { winner, scoreA, scoreB, results };
}

export default function VersusPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<VersusCategory>('songs');
  const [pickSide, setPickSide] = useState<'a' | 'b' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [competitorA, setCompetitorA] = useState<VersusCompetitor | null>(null);
  const [competitorB, setCompetitorB] = useState<VersusCompetitor | null>(null);

  const criteria = useMemo(() => getCriteria(category), [category]);
  const competitors = useMemo(() => getCompetitors(category), [category]);

  const handleCategoryChange = (cat: VersusCategory) => {
    if (cat === category) return;
    setCategory(cat);
    setCompetitorA(null);
    setCompetitorB(null);
    setSearchQuery('');
    setPickSide(null);
  };

  const openPicker = (side: 'a' | 'b') => {
    setPickSide(side);
    setSearchQuery('');
  };

  const closePicker = () => {
    setPickSide(null);
    setSearchQuery('');
  };

  const selectCompetitor = (comp: VersusCompetitor) => {
    if (pickSide === 'a') setCompetitorA(comp);
    else if (pickSide === 'b') setCompetitorB(comp);
    closePicker();
  };

  const swap = () => {
    setCompetitorA(competitorB);
    setCompetitorB(competitorA);
  };

  const clearAll = () => {
    setCompetitorA(null);
    setCompetitorB(null);
  };

  const filteredCompetitors = useMemo(() => {
    if (!searchQuery.trim()) return competitors;
    const q = searchQuery.toLowerCase();
    return competitors.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q),
    );
  }, [competitors, searchQuery]);

  const outcome = useMemo(() => {
    if (!competitorA || !competitorB) return null;
    return computeOutcome(competitorA, competitorB, criteria);
  }, [competitorA, competitorB, criteria]);

  const bothSelected = competitorA && competitorB;
  const pickerOpen = pickSide !== null;

  return (
    <>
      <SiteHeader
        activePath="/versus"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="chart-banner-img versus-banner" role="region" aria-label="Versus banner">
        <img src={pageBannerSrc('versus')} alt="Versus banner" />
      </div>

      <main id="main-content">
        <h1 className="visually-hidden">Versus</h1>

        <div className="shell versus-shell">
          <section className="versus-intro" aria-label="Versus introduction">
            <div className="versus-intro__icon">
              <Swords size={32} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="versus-intro__title">Head-to-Head</h2>
            <p className="versus-intro__copy">
              Pick two {CATEGORY_LABELS[category].toLowerCase()} and compare them across five chart
              criteria. The contender that wins more categories takes the crown.
            </p>
          </section>

          <div className="versus-category-bar" role="tablist" aria-label="Comparison category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={cat === category}
                className={`versus-category-btn${cat === category ? ' is-active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <section className="versus-arena" aria-label="Comparison arena">
            <div className="versus-slot versus-slot--a">
              <CompetitorCard
                competitor={competitorA}
                side="a"
                category={category}
                onPick={() => openPicker('a')}
                onClear={() => setCompetitorA(null)}
                outcome={outcome}
              />
            </div>

            <div className="versus-center">
              <div className="versus-vs-badge">
                <span>VS</span>
              </div>
              {bothSelected && (
                <button type="button" className="versus-swap-btn" onClick={swap} aria-label="Swap contenders">
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="versus-slot versus-slot--b">
              <CompetitorCard
                competitor={competitorB}
                side="b"
                category={category}
                onPick={() => openPicker('b')}
                onClear={() => setCompetitorB(null)}
                outcome={outcome}
              />
            </div>
          </section>

          {bothSelected && outcome && (
            <>
              <section className="versus-scoreboard" aria-label="Overall score">
                <div className="versus-scoreboard__bar">
                  <div
                    className="versus-scoreboard__fill versus-scoreboard__fill--a"
                    style={{ width: `${(outcome.scoreA / (outcome.scoreA + outcome.scoreB || 1)) * 100}%` }}
                  />
                  <div
                    className="versus-scoreboard__fill versus-scoreboard__fill--b"
                    style={{ width: `${(outcome.scoreB / (outcome.scoreA + outcome.scoreB || 1)) * 100}%` }}
                  />
                </div>
                <div className="versus-scoreboard__labels">
                  <span className="versus-scoreboard__label versus-scoreboard__label--a">
                    {competitorA.title}
                    <strong>{outcome.scoreA}</strong>
                  </span>
                  <span className="versus-scoreboard__label versus-scoreboard__label--b">
                    {competitorB.title}
                    <strong>{outcome.scoreB}</strong>
                  </span>
                </div>
              </section>

              <section className="versus-verdict" aria-label="Verdict">
                <div className={`versus-verdict__badge versus-verdict__badge--${outcome.winner}`}>
                  {outcome.winner === 'tie' ? (
                    <>
                      <Minus size={28} aria-hidden="true" />
                      <span>Dead Heat</span>
                    </>
                  ) : (
                    <>
                      <Trophy size={28} aria-hidden="true" />
                      <span>{outcome.winner === 'a' ? competitorA.title : competitorB.title}</span>
                    </>
                  )}
                </div>
                <p className="versus-verdict__text">
                  {outcome.winner === 'tie'
                    ? `It's a draw — each contender wins ${outcome.scoreA} of ${outcome.results.length} criteria.`
                    : `${outcome.winner === 'a' ? competitorA.title : competitorB.title} wins ${outcome.winner === 'a' ? outcome.scoreA : outcome.scoreB} of ${outcome.results.length} criteria against ${outcome.winner === 'a' ? competitorB.title : competitorA.title}.`}
                </p>
              </section>

              <section className="versus-breakdown" aria-label="Criterion breakdown">
                <div className="section-head">
                  <h2>Criterion Breakdown</h2>
                  {bothSelected && (
                    <button type="button" className="section-head-label versus-clear-btn" onClick={clearAll}>
                      Reset
                    </button>
                  )}
                </div>

                <div className="versus-breakdown-grid">
                  {outcome.results.map((r) => (
                    <CriterionRow key={r.key} result={r} titleA={competitorA.title} titleB={competitorB.title} />
                  ))}
                </div>
              </section>
            </>
          )}

          {!bothSelected && (
            <div className="versus-empty-hint">
              <span className="morph-chevron" aria-hidden="true" />
              <span>Select two {CATEGORY_LABELS[category].toLowerCase()} to begin the comparison</span>
            </div>
          )}
        </div>
      </main>

      <div className={`versus-picker-overlay${pickerOpen ? ' is-open' : ''}`} onClick={closePicker} aria-hidden={!pickerOpen} />
      <aside
        className={`versus-picker${pickerOpen ? ' is-open' : ''}`}
        aria-label={`Pick a ${CATEGORY_LABELS[category].toLowerCase().replace(/s$/, '')}`}
        aria-hidden={!pickerOpen}
      >
        <div className="versus-picker__head">
          <h3>
            Select {pickSide === 'a' ? 'Contender A' : pickSide === 'b' ? 'Contender B' : 'a Contender'}
          </h3>
          <button type="button" className="versus-picker__close" onClick={closePicker} aria-label="Close picker">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="versus-picker__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder={`Search ${CATEGORY_LABELS[category].toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="versus-picker__list">
          {filteredCompetitors.length === 0 && (
            <p className="versus-picker__empty">No results found.</p>
          )}
          {filteredCompetitors.map((comp) => {
            const isOtherSide =
              (pickSide === 'a' && competitorB?.id === comp.id) ||
              (pickSide === 'b' && competitorA?.id === comp.id);
            return (
              <button
                key={comp.id}
                type="button"
                className="versus-picker__item"
                disabled={isOtherSide}
                onClick={() => selectCompetitor(comp)}
              >
                <img src={comp.coverSrc} alt="" className="versus-picker__cover" />
                <div className="versus-picker__copy">
                  <strong>{comp.title}</strong>
                  <span>{comp.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <SiteFooter />
    </>
  );
}

interface CompetitorCardProps {
  competitor: VersusCompetitor | null;
  side: 'a' | 'b';
  category: VersusCategory;
  onPick: () => void;
  onClear: () => void;
  outcome: VersusOutcome | null;
}

function CompetitorCard({ competitor, side, category, onPick, onClear, outcome }: CompetitorCardProps) {
  const isWinner = outcome && outcome.winner === side;
  const isLoser = outcome && outcome.winner !== 'tie' && outcome.winner !== side;

  if (!competitor) {
    return (
      <button type="button" className="versus-card versus-card--empty" onClick={onPick}>
        <div className="versus-card__placeholder">
          <span className="versus-card__side-label">{side === 'a' ? 'A' : 'B'}</span>
          <Search size={24} aria-hidden="true" />
          <span className="versus-card__placeholder-text">
            Pick a {CATEGORY_LABELS[category].toLowerCase().replace(/s$/, '')}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className={`versus-card${isWinner ? ' is-winner' : ''}${isLoser ? ' is-loser' : ''}`}>
      <div className="versus-card__head">
        <span className="versus-card__side-label">{side === 'a' ? 'A' : 'B'}</span>
        {isWinner && (
          <span className="versus-card__winner-tag">
            <Trophy size={14} aria-hidden="true" /> Winner
          </span>
        )}
        <button type="button" className="versus-card__clear" onClick={onClear} aria-label="Remove contender">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="versus-card__body">
        <img src={competitor.coverSrc} alt="" className="versus-card__cover" />
        <div className="versus-card__copy">
          <strong className="versus-card__title">{competitor.title}</strong>
          <span className="versus-card__subtitle">{competitor.subtitle}</span>
        </div>
      </div>
      <a href={competitor.href} className="versus-card__link">
        View {CATEGORY_LABELS[category].toLowerCase().replace(/s$/, '')} page
      </a>
    </div>
  );
}

interface CriterionRowProps {
  result: CriterionResult;
  titleA: string;
  titleB: string;
}

function CriterionRow({ result, titleA, titleB }: CriterionRowProps) {
  return (
    <div className={`versus-criterion versus-criterion--${result.winner}`}>
      <div className="versus-criterion__head">
        <span className="versus-criterion__label">{result.label}</span>
      </div>
      <p className="versus-criterion__desc">{result.description}</p>
      <div className="versus-criterion__bar">
        <div
          className="versus-criterion__fill versus-criterion__fill--a"
          style={{ width: `${result.shareA * 100}%` }}
          aria-hidden="true"
        />
        <div
          className="versus-criterion__fill versus-criterion__fill--b"
          style={{ width: `${result.shareB * 100}%` }}
          aria-hidden="true"
        />
        <span className="versus-criterion__value versus-criterion__value--a">
          <b>{result.displayA}</b>
        </span>
        <span className="versus-criterion__value versus-criterion__value--b">
          <b>{result.displayB}</b>
        </span>
      </div>
      <span className="versus-criterion__winner">
        {result.winner === 'tie' ? (
          <>Tie</>
        ) : (
          <>{result.winner === 'a' ? titleA : titleB} wins</>
        )}
      </span>
    </div>
  );
}
