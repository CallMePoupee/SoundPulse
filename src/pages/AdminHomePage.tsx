import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Music2,
  Mic2,
  Disc3,
  Swords,
  Trophy,
  Activity,
  Tag,
  Newspaper,
  Plus,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { pageBannerSrc } from '@/utils/slug';
import ChartBanner from '@/components/ChartBanner';
import SiteHeader from '@/components/SiteHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchPanel from '@/components/SearchPanel';
import SiteFooter from '@/components/SiteFooter';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Admin Dashboard' },
];

interface AdminTile {
  label: string;
  description: string;
  icon: typeof BarChart3;
  href: string;
}

const tiles: AdminTile[] = [
  {
    label: 'Add Music',
    description: 'Add new songs, albums, and performers to the database.',
    icon: Plus,
    href: '/admin/add-music',
  },
  {
    label: 'Charts',
    description: 'Manage weekly chart entries, weeks, and notable events.',
    icon: BarChart3,
    href: '/admin/charts',
  },
  {
    label: 'The Pulse',
    description: 'All-time rankings of songs, albums, and performers by total chart points.',
    icon: Activity,
    href: '/admin/pulse',
  },
  {
    label: 'Hall of Fame',
    description: 'Celebrate the greatest achievements and milestones in chart history.',
    icon: Trophy,
    href: '/admin/hall-of-fame',
  },
  {
    label: 'Songs',
    description: 'Add, edit, and organize the song archive.',
    icon: Music2,
    href: '/admin/songs',
  },
  {
    label: 'Performers',
    description: 'Manage performer profiles, genres, and stats.',
    icon: Mic2,
    href: '/admin/performers',
  },
  {
    label: 'Albums',
    description: 'Maintain the album archive and cover art.',
    icon: Disc3,
    href: '/admin/albums',
  },
  {
    label: 'Genres',
    description: 'Organize musical genres and their associated performers.',
    icon: Tag,
    href: '/admin/genres',
  },
  {
    label: 'Versus',
    description: 'Configure versus matchups and comparisons.',
    icon: Swords,
    href: '/admin/versus',
  },
  {
    label: 'Blog',
    description: 'Publish weekly news featuring the #1 song and chart overviews.',
    icon: Newspaper,
    href: '/admin/blog',
  },
];

export default function AdminHomePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <Loader2 className="admin-auth-spinner" size={32} aria-hidden />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <SiteHeader
        activePath="/admin"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />
      <main id="main-content" className="admin-home-main">
      <ChartBanner era="Admin Dashboard" bannerSrc={pageBannerSrc('admin-home')} />
      <div className="shell admin-home-shell">
        <header className="admin-home-header">
          <div className="admin-home-header__text">
            <h1 className="admin-home-header__title">Admin Dashboard</h1>
            <p className="admin-home-header__welcome">
              Signed in as <strong>{user.email}</strong>
            </p>
          </div>
          <button
            type="button"
            className="admin-signout-btn"
            onClick={handleSignOut}
          >
            <LogOut size={16} aria-hidden />
            <span>Sign Out</span>
          </button>
        </header>

        <section className="admin-tile-grid" aria-label="Management areas">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <a key={tile.href} href={tile.href} className="admin-tile">
                <span className="admin-tile__icon" aria-hidden>
                  <Icon size={24} />
                </span>
                <span className="admin-tile__body">
                  <strong className="admin-tile__label">{tile.label}</strong>
                  <span className="admin-tile__description">{tile.description}</span>
                </span>
              </a>
            );
          })}
        </section>
      </div>
      </main>
      <SiteFooter />
    </>
  );
}
