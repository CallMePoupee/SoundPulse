import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ChartEntry } from '@/types/chart';
import { songPath, performerPath, albumPath } from '@/utils/slug';

interface ChartRowProps {
  entry: ChartEntry;
}

export default function ChartRow({ entry }: ChartRowProps) {
  const rowClasses = [
    'chart-row',
    entry.status ?? '',
    entry.eventClass ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const moveClasses = ['move-cell', entry.moveClass ?? ''].filter(Boolean).join(' ');

  const renderMove = () => {
    if (entry.moveClass === 'up') {
      return (
        <>
          <ArrowUp className="move-arrow" aria-hidden />
          <span className="visually-hidden">Up </span>
          {entry.move.replace(/[↑↓]/g, '').trim()}
        </>
      );
    }
    if (entry.moveClass === 'down') {
      return (
        <>
          <ArrowDown className="move-arrow" aria-hidden />
          <span className="visually-hidden">Down </span>
          {entry.move.replace(/[↑↓]/g, '').trim()}
        </>
      );
    }
    return entry.move;
  };

  const stateNoteText = entry.eventLabel ?? entry.stateNote ?? '';

  return (
    <div className={rowClasses} role="row">
      <div className="cell rank-cell" role="cell">
        <span className="rank">{entry.rank}</span>
        {stateNoteText && <span className="state-note">{stateNoteText}</span>}
      </div>
      <div className="cell prev-cell" role="cell">{entry.previous}</div>
      <div className={`cell ${moveClasses}`} role="cell">{renderMove()}</div>
      <div className="cell identity-cell" role="cell">
        <a className="song" href={songPath(entry.performer, entry.album, entry.song)}>{entry.song}</a>
        <a className="performer" href={performerPath(entry.performer)}>{entry.performer}</a>
        <span className="album-line">
          {entry.note} <a href={albumPath(entry.performer, entry.album)}><strong>{entry.album}</strong></a> {entry.suffix}
        </span>
      </div>
      <div className="cell numeric peak-cell" role="cell">
        <span className="mobile-label" aria-hidden="true">PEAK</span>
        <span className="peak-value">{entry.peak}</span>
      </div>
      <div className="cell numeric weeks-cell" role="cell">
        <span className="mobile-label" aria-hidden="true">WEEKS</span>
        <span className="weeks-value">{entry.weeks}</span>
      </div>
    </div>
  );
}
