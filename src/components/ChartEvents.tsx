import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ChartEvent } from '@/types/chart';

interface ChartEventsProps {
  events: ChartEvent[];
}

export default function ChartEvents({ events }: ChartEventsProps) {
  return (
    <aside className="chart-events-sidebar" aria-label="Notable chart events">
      <section className="chart-events-panel" aria-labelledby="notable-events-heading">
        <h2 id="notable-events-heading">Notable Chart Events</h2>
        <div className="chart-events-list">
          {events.map((event, index) => (
            <div key={index} className={`chart-event-item ${event.eventClass}`}>
              <div className="peak-badge">
                <b>
                  {event.badgeArrow === 'up' && (
                    <ArrowUp className="badge-arrow" size={12} aria-hidden />
                  )}
                  {event.badgeArrow === 'down' && (
                    <ArrowDown className="badge-arrow" size={12} aria-hidden />
                  )}
                  {event.badgeValue}
                  {event.badgeSuperscript && <sup>{event.badgeSuperscript}</sup>}
                </b>
                <small>
                {event.badgeLabel.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </small>
              </div>
              <div className="info">
                <strong>{event.label}</strong>
                <span>{event.copy}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
