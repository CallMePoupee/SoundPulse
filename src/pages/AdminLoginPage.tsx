import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
const adminLoginBannerSrc = '/banners/pages/banner-admin-login copy.png';
import SiteHeader from '@/components/SiteHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchPanel from '@/components/SearchPanel';
import SiteFooter from '@/components/SiteFooter';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Admin', href: '/admin' },
  { label: 'Sign In' },
];

type PopupStatus = 'idle' | 'denied' | 'granted';

export default function AdminLoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupStatus>('idle');
  const [searchOpen, setSearchOpen] = useState(false);

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <Loader2 className="admin-auth-spinner" size={32} aria-hidden />
        <span>Loading...</span>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setPopup('denied');
      window.setTimeout(() => setPopup('idle'), 3000);
      return;
    }

    setSubmitting(true);

    const { error: signInError } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setPopup('denied');
      window.setTimeout(() => setPopup('idle'), 3000);
      return;
    }

    setPopup('granted');
    window.setTimeout(() => navigate('/admin', { replace: true }), 1500);
  };

  return (
    <>
      <SiteHeader
        activePath="/admin/login"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />
      <main id="main-content" className="admin-auth-main">
        <section
          className="admin-login-hero"
          aria-label="Admin sign in"
          style={{ backgroundImage: `url("${adminLoginBannerSrc}")` }}
        >
          <h1 className="visually-hidden">Admin Sign In</h1>
          <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
            <label className="admin-login-field admin-login-field--email">
              <span className="visually-hidden">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={submitting}
              />
            </label>

            <label className="admin-login-field admin-login-field--password">
              <span className="visually-hidden">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </label>

            <button type="submit" className="admin-login-submit" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="admin-auth-spinner" aria-hidden /> : 'Sign In'}
            </button>
          </form>
        </section>
        <div className="shell admin-auth-shell">
          <a href="/home" className="admin-auth-back-link">
            Back to site
          </a>
        </div>
      </main>
      <SiteFooter />

      {popup !== 'idle' && (
        <div
          className="admin-login-popup"
          role="alert"
          onClick={() => setPopup('idle')}
        >
          <img
            src={
              popup === 'granted'
                ? '/popups/popup-access-granted.png'
                : '/popups/popup-access-denied.png'
            }
            alt={popup === 'granted' ? 'Access granted' : 'Access denied'}
            className="admin-login-popup__img"
          />
        </div>
      )}
    </>
  );
}
