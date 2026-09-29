import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import WeeklyChartPage from '@/pages/WeeklyChartPage';
import SongPage from '@/pages/SongPage';
import AlbumPage from '@/pages/AlbumPage';
import PerformerPage from '@/pages/PerformerPage';
import PerformersPage from '@/pages/PerformersPage';
import SongsPage from '@/pages/SongsPage';
import AlbumsPage from '@/pages/AlbumsPage';
import VersusPage from '@/pages/VersusPage';
import { AuthProvider } from '@/context/AuthContext';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminHomePage from '@/pages/AdminHomePage';
import AdminAddMusicPage from '@/pages/AdminAddMusicPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/performers" element={<PerformersPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/versus" element={<VersusPage />} />
        <Route path="/charts/1999/week-of-september-14" element={<WeeklyChartPage />} />
        <Route path="/:performer/:album" element={<AlbumPage />} />
        <Route path="/:performer/:album/:song" element={<SongPage />} />
        <Route path="/:performer" element={<PerformerPage />} />
        <Route
          path="/admin"
          element={
            <AuthProvider>
              <Outlet />
            </AuthProvider>
          }
        >
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="add-music" element={<AdminAddMusicPage />} />
          <Route index element={<AdminHomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/charts/1999/week-of-september-14" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
