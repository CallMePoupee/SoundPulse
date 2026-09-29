import type { BreadcrumbItem } from '@/types/chart';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="shell">
      <div className="breadcrumbs-bar">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumbs">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <li key={index} className="breadcrumbs__item" aria-current={isLast ? 'page' : undefined}>
                  {item.href && !isLast ? (
                    <a className="breadcrumbs__link" href={item.href}>
                      {item.label}
                    </a>
                  ) : (
                    <span className="breadcrumbs__current">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
