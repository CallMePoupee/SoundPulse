import { useState } from 'react';
import type { WeekEntry } from '@/types/song';

interface RankingChartProps {
  data: WeekEntry[];
  title?: string;
}

const VIEWBOX_WIDTH = 900;
const VIEWBOX_HEIGHT = 500;
const PLOT = { left: 72, right: 870, top: 28, bottom: 420 };
const MAX_RANK = 40;

const majorRanks = [1, 10, 20, 30, 40];
const minorRanks = [5, 15, 25, 35];

function getX(index: number, count: number): number {
  return PLOT.left + (index / Math.max(count - 1, 1)) * (PLOT.right - PLOT.left);
}

function getY(rank: number): number {
  return PLOT.top + ((rank - 1) / (MAX_RANK - 1)) * (PLOT.bottom - PLOT.top);
}

interface DisplayPoint {
  x: number;
  y: number;
  rank: number;
}

export default function RankingChart({ data, title = 'Chart performance' }: RankingChartProps) {
  const fallbackIndex = Math.min(5, Math.max(data.length - 1, 0));
  const [activeIndex, setActiveIndex] = useState<number | null>(fallbackIndex);
  const [displayPoint, setDisplayPoint] = useState<DisplayPoint>(() => {
    const entry = data[fallbackIndex];
    return { x: getX(fallbackIndex, data.length), y: getY(entry.rank), rank: entry.rank };
  });

  const points = data.map((entry, index) => ({
    ...entry,
    x: getX(index, data.length),
    y: getY(entry.rank),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const isActive = activeIndex !== null;

  const handleEnter = (index: number) => {
    setActiveIndex(index);
    setDisplayPoint({ x: points[index].x, y: points[index].y, rank: points[index].rank });
  };

  const handleLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="ranking-chart">
      <svg
        className="ranking-chart__svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label={title}
      >
        <g className="ranking-chart__grid" aria-hidden="true">
          {Array.from({ length: data.length }, (_, index) => {
            const x = getX(index, data.length);
            return <line key={`vertical-${index}`} x1={x} x2={x} y1={PLOT.top} y2={PLOT.bottom} />;
          })}
          {Array.from({ length: 8 }, (_, index) => {
            const rank = index * 5 + 5;
            const y = getY(rank);
            return <line key={`horizontal-${rank}`} x1={PLOT.left} x2={PLOT.right} y1={y} y2={y} />;
          })}
        </g>

        <g className="ranking-chart__axis" aria-hidden="true">
          <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={PLOT.bottom} />
          <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} />
          {points.map((point, index) => (
            <line key={`x-tick-${index}`} x1={point.x} x2={point.x} y1={PLOT.bottom} y2={PLOT.bottom + 9} />
          ))}
          {majorRanks.map((rank) => {
            const y = getY(rank);
            return <line key={`y-tick-${rank}`} x1={PLOT.left - 9} x2={PLOT.left} y1={y} y2={y} />;
          })}
        </g>

        <g className="ranking-chart__labels" aria-hidden="true">
          {majorRanks.map((rank) => (
            <text key={`major-label-${rank}`} x={PLOT.left - 17} y={getY(rank) + 4} className="ranking-chart__label ranking-chart__label--major">
              {rank}
            </text>
          ))}
          {minorRanks.map((rank) => (
            <text key={`minor-label-${rank}`} x={PLOT.left - 17} y={getY(rank) + 4} className="ranking-chart__label">
              {rank}
            </text>
          ))}
          {points.map((point, index) => (
            <text key={`x-label-${index}`} x={point.x} y={PLOT.bottom + 30} className="ranking-chart__x-label">
              {index + 1}
            </text>
          ))}
          <text
            x={PLOT.left - 55}
            y={(PLOT.top + PLOT.bottom) / 2}
            className="ranking-chart__axis-title ranking-chart__axis-title--y"
            transform={`rotate(-90 ${PLOT.left - 55} ${(PLOT.top + PLOT.bottom) / 2})`}
          >
            RANK
          </text>
          <text x={(PLOT.left + PLOT.right) / 2} y={PLOT.bottom + 55} className="ranking-chart__axis-title ranking-chart__axis-title--x">
            Week on Chart
          </text>
        </g>

        <path className="ranking-chart__line" d={path} />

        {points.map((point, index) => (
          <g
            key={`${point.date}-${point.rank}`}
            className={`ranking-chart__point${activeIndex === index ? ' is-active' : ''}`}
          >
            <rect
              className="ranking-chart__week-hit"
              x={index === 0 ? PLOT.left : (points[index - 1].x + point.x) / 2}
              y={PLOT.top}
              width={index === points.length - 1 ? PLOT.right - ((points[index - 1].x + point.x) / 2) : ((points[index + 1].x + point.x) / 2) - (index === 0 ? PLOT.left : (points[index - 1].x + point.x) / 2)}
              height={PLOT.bottom - PLOT.top}
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
              onFocus={() => handleEnter(index)}
              onBlur={handleLeave}
              tabIndex={0}
              aria-label={`${point.date}: rank ${point.rank}`}
            />
            <circle className="ranking-chart__dot" cx={point.x} cy={point.y} r="4.5" />
          </g>
        ))}

        <g
          className={`ranking-chart__active-label${isActive ? ' is-visible' : ''}`}
          pointerEvents="none"
        >
          <circle cx={displayPoint.x} cy={displayPoint.y} r="18" />
          <text x={displayPoint.x} y={displayPoint.y}>{displayPoint.rank}</text>
        </g>
      </svg>
    </div>
  );
}
