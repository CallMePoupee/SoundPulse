const NAV_ITEMS = [
  { label: 'Charts', href: '/charts', icon: 'charts' },
  { label: 'Performers', href: '/performers', icon: 'performers' },
  { label: 'Songs', href: '/songs', icon: 'songs' },
  { label: 'Albums', href: '/albums', icon: 'albums' },
  { label: 'Versus', href: '/versus', icon: 'versus' },
  { label: 'Records', href: '/hall-of-fame', icon: 'hall-of-fame' },
];

interface SiteHeaderProps {
  activePath?: string;
  onSearchToggle: () => void;
  searchOpen: boolean;
}

export default function SiteHeader({ activePath, onSearchToggle, searchOpen }: SiteHeaderProps) {
  const isActive = (href: string) => {
    if (!activePath) return false;
    if (href === '/charts') return activePath.startsWith('/charts');
    return activePath === href;
  };

  return (
    <header className="site-header" role="banner">
      <div className="shell site-header__inner">
        <a className="brand" href="/home" aria-label="ALT CHARTS Homepage">
          <img src="/header/logo.png" alt="ALT CHARTS" className="brand-logo" />
        </a>
        <nav className="main-nav" aria-label="Primary Navigation">
          <div className="main-nav__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                className={`nav-btn${isActive(item.href) ? ' active' : ''}`}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <img
                  src={`/header/navigation-${item.icon}.png`}
                  alt={item.label}
                  className="nav-btn__img nav-btn__img--default"
                />
                <img
                  src={`/header/navigation-${item.icon}-hover.png`}
                  alt=""
                  aria-hidden="true"
                  className="nav-btn__img nav-btn__img--hover"
                />
              </a>
            ))}
          </div>
          <button
            type="button"
            id="searchToggle"
            className="nav-btn main-nav__search-btn"
            aria-expanded={searchOpen}
            aria-controls="searchPanel"
            onClick={onSearchToggle}
          >
            <img
              src="/header/navigation-search.png"
              alt="Search"
              className="nav-btn__img nav-btn__img--default"
            />
            <img
              src="/header/navigation-search-hover.png"
              alt=""
              aria-hidden="true"
              className="nav-btn__img nav-btn__img--hover"
            />
          </button>
        </nav>
      </div>
    </header>
  );
}
