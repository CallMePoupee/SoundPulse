import ChartRow from './ChartRow';
import ChartWeekNav from './ChartWeekNav';
import type { WeeklyChart, ChartEntry } from '@/types/chart';

interface ChartTableProps {
  chart: WeeklyChart;
}

export default function ChartTable({ chart }: ChartTableProps) {
  return (
    <div className="chart-table" role="table" aria-label={`${chart.eraLabel} weekly ranking table`}>
      <ChartWeekNav chart={chart} />
      <div className="chart-columns" role="row" aria-hidden="true">
        <div role="columnheader" className="num">TW</div>
        <div role="columnheader" className="num prev-head">LW</div>
        <div role="columnheader" className="num">+/-</div>
        <div role="columnheader">Song / Performer / Album</div>
        <div role="columnheader" className="num">Peak</div>
        <div role="columnheader" className="num">Weeks</div>
      </div>
      <div id="weeklyChartRows" role="rowgroup">
        {chart.entries.map((entry: ChartEntry) => (
          <ChartRow key={entry.rank} entry={entry} />
        ))}
      </div>
    </div>
  );
}
