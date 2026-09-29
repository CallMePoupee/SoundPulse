import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { WeeklyChart } from '@/types/chart';

interface ChartWeekNavProps {
  chart: WeeklyChart;
}

export default function ChartWeekNav({ chart }: ChartWeekNavProps) {
  return (
    <div className="chart-week-nav" role="region" aria-label="Chart week navigation">
      <a
        className="chart-week-nav__link chart-week-nav__link--prev"
        href={chart.prevWeekHref}
        aria-label={`Previous chart week: ${chart.prevWeekLabel}`}
      >
        <ArrowLeft size={14} aria-hidden />
        <span>{chart.prevWeekLabel}</span>
      </a>
      <div className="chart-week-nav__current" aria-current="date">
        {chart.weekLabel}
      </div>
      <a
        className="chart-week-nav__link chart-week-nav__link--next"
        href={chart.nextWeekHref}
        aria-label={`Next chart week: ${chart.nextWeekLabel}`}
      >
        <span>{chart.nextWeekLabel}</span>
        <ArrowRight size={14} aria-hidden />
      </a>
    </div>
  );
}
