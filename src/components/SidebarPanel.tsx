import type { SidebarItem } from '@/types/song';
import { songPath, albumPath } from '@/utils/slug';

interface SidebarPanelProps {
  headingId: string;
  heading: string;
  items: SidebarItem[];
  linkType?: 'song' | 'album';
}

export default function SidebarPanel({ headingId, heading, items, linkType = 'song' }: SidebarPanelProps) {
  return (
    <section className="panel" aria-labelledby={headingId}>
      <h3 id={headingId}>{heading}</h3>
      <div className="panel-list">
        {items.map((item, index) => {
          const href = item.href
            ?? (linkType === 'album'
              ? albumPath(item.performer, item.title)
              : songPath(item.performer, item.title, item.title));
          return (
            <a key={index} href={href} className="panel-item">
              <div className="peak-badge">
                <small>PEAK</small>
                <b>{item.peak}</b>
              </div>
              <div className="info">
                <strong>{item.title}</strong>
                <span>{item.performer}</span>
              </div>
              <div className="metric">
                <b>{item.metric}</b>
                <small>{item.metricLabel}</small>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
