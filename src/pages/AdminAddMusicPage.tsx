import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Download, CircleAlert as AlertCircle, CircleCheck as CheckCircle, X, Save, ImagePlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SiteHeader from '@/components/SiteHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchPanel from '@/components/SearchPanel';
import SiteFooter from '@/components/SiteFooter';

const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Admin Dashboard', href: '/admin' },
  { label: 'Add Music' },
];

interface ParsedSong {
  title: string;
  performer: string;
  album: string;
  releaseYear: string;
  recordLabel: string;
  genre: string;
  cityOfOrigin: string;
  activeSince: string;
  errors: string[];
  hasAsset: boolean;
}

const CSV_SCHEMA = [
  'Song Title',
  'Performer(s)', 
  'Album Title',
  'Album Release Year',
  'Record Label',
  'Genre(s)',
  'City of Origin',
  'Active Since'
];

const SAMPLE_CSV = `"In the End","Linkin Park","Hybrid Theory","2000","Warner Bros. Records","Nu Metal / Rap Rock","Agoura Hills, CA, USA","1996"
"My Sacrifice","Creed","Weathered","2001","Epic / Wind-up Records","Post-Grunge / Hard Rock","Tallahassee, FL, USA","1994"
"Blurry","Puddle of Mudd","Come Clean","2001","Flawless / Geffen","Post-Grunge / Nu Metal","Kansas City, MO, USA","1991"`;

export default function AdminAddMusicPage() {
  const { user, loading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [parsedSongs, setParsedSongs] = useState<ParsedSong[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const validateSong = useCallback((song: Partial<ParsedSong>): string[] => {
    const errors: string[] = [];
    
    if (!song.title?.trim()) errors.push('Song title is required');
    if (!song.performer?.trim()) errors.push('Performer is required');
    if (!song.album?.trim()) errors.push('Album title is required');
    if (!song.releaseYear?.trim()) errors.push('Release year is required');
    else {
      const year = parseInt(song.releaseYear);
      if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
        errors.push('Release year must be between 1950 and current year');
      }
    }
    
    if (song.activeSince?.trim()) {
      const activeSince = parseInt(song.activeSince);
      if (isNaN(activeSince) || activeSince < 1950 || activeSince > new Date().getFullYear()) {
        errors.push('Active since must be between 1950 and current year');
      }
    }

    return errors;
  }, []);

  const checkAssetExists = useCallback((title: string, performer: string): boolean => {
    // Simulate asset checking - in real implementation, this would check actual files
    const mockAssets = [
      'in-the-end-linkin-park',
      'my-sacrifice-creed',
      'blurry-puddle-of-mudd',
      'alive-pod',
      'how-you-remind-me-nickelback'
    ];
    
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${performer.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return mockAssets.includes(filename);
  }, []);

  const parseCSV = useCallback((csvText: string): ParsedSong[] => {
    if (!csvText.trim()) return [];

    const lines = csvText.trim().split('\n');
    const songs: ParsedSong[] = [];

    // Process all rows (no header row)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles quoted fields)
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());

      // Pad with empty strings if not enough fields
      while (fields.length < CSV_SCHEMA.length) {
        fields.push('');
      }

      const song: Partial<ParsedSong> = {
        title: fields[0] || '',
        performer: fields[1] || '',
        album: fields[2] || '',
        releaseYear: fields[3] || '',
        recordLabel: fields[4] || '',
        genre: fields[5] || '',
        cityOfOrigin: fields[6] || '',
        activeSince: fields[7] || ''
      };

      const songErrors = validateSong(song);
      const hasAsset = checkAssetExists(song.title || '', song.performer || '');

      songs.push({
        ...song as ParsedSong,
        errors: songErrors,
        hasAsset
      });
    }

    return songs;
  }, [validateSong, checkAssetExists]);

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <div className="admin-auth-spinner">
          <div className="admin-spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleCSVChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCsvInput(value);
    
    if (value.trim()) {
      setIsProcessing(true);
      setTimeout(() => {
        const parsed = parseCSV(value);
        setParsedSongs(parsed);
        setShowPreview(parsed.length > 0);
        setIsProcessing(false);
      }, 300);
    } else {
      setParsedSongs([]);
      setShowPreview(false);
    }
  };

  const handleLoadSample = () => {
    setCsvInput(SAMPLE_CSV);
    const parsed = parseCSV(SAMPLE_CSV);
    setParsedSongs(parsed);
    setShowPreview(true);
  };

  const handleClear = () => {
    setCsvInput('');
    setParsedSongs([]);
    setShowPreview(false);
  };

  const handleImport = async () => {
    const validSongs = parsedSongs.filter(song => song.errors.length === 0);
    if (validSongs.length === 0) {
      alert('No valid songs to import. Please fix validation errors first.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Successfully imported ${validSongs.length} songs!`);
    handleClear();
    setIsProcessing(false);
  };

  const validSongs = parsedSongs.filter(song => song.errors.length === 0);
  const invalidSongs = parsedSongs.filter(song => song.errors.length > 0);

  return (
    <>
      <SiteHeader
        activePath="/admin/add-music"
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        searchOpen={searchOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Breadcrumbs items={breadcrumbItems} />

      <main id="main-content">
        <h1 className="visually-hidden">Add Music - Admin Panel</h1>

        <div className="admin-csv-interface admin-csv-interface--nav-width">
          {/* Background Image with Textarea Overlay */}
          <div className="admin-csv-background">
            <img
              src="/interface/add-songs-from-csv.png"
              alt="Add Songs from CSV Interface"
              className="admin-csv-background-image"
            />
            <textarea
              className="admin-csv-overlay-textarea"
              value={csvInput}
              onChange={handleCSVChange}
              placeholder="Paste your CSV data here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="admin-csv-actions">
            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={handleLoadSample}
            >
              <Download size={16} />
              Load Sample Data
            </button>
            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={handleClear}
              disabled={!csvInput}
            >
              <X size={16} />
              Clear
            </button>
          </div>

          {/* Results Section */}
          {showPreview && parsedSongs.length > 0 && (
            <div className="admin-csv-results">
              {/* Summary Statistics */}
              <div className="admin-csv-summary">
                <div className="admin-csv-summary-header">
                  <h3>Import Summary</h3>
                  <div className="admin-csv-summary-stats">
                    <div className="admin-csv-stat admin-csv-stat--total">
                      <span className="admin-csv-stat-value">{parsedSongs.length}</span>
                      <span className="admin-csv-stat-label">Total Songs</span>
                    </div>
                    <div className="admin-csv-stat admin-csv-stat--success">
                      <span className="admin-csv-stat-value">{validSongs.length}</span>
                      <span className="admin-csv-stat-label">Valid</span>
                    </div>
                    <div className="admin-csv-stat admin-csv-stat--error">
                      <span className="admin-csv-stat-value">{invalidSongs.length}</span>
                      <span className="admin-csv-stat-label">Errors</span>
                    </div>
                    <div className="admin-csv-stat admin-csv-stat--assets">
                      <span className="admin-csv-stat-value">{parsedSongs.filter(s => s.hasAsset).length}</span>
                      <span className="admin-csv-stat-label">With Assets</span>
                    </div>
                  </div>
                </div>

                {/* Import Actions */}
                {validSongs.length > 0 && (
                  <div className="admin-csv-import-actions">
                    <button
                      type="button"
                      className="admin-button admin-button--primary"
                      onClick={handleImport}
                      disabled={isProcessing}
                    >
                      <Save size={16} />
                      {isProcessing ? 'Importing...' : `Import ${validSongs.length} Valid Songs`}
                    </button>
                  </div>
                )}
              </div>

              {/* Song Cards */}
              <div className="admin-csv-preview">
                <div className="admin-csv-preview-header">
                  <h4>Song Details</h4>
                  <span className="admin-csv-preview-count">
                    {parsedSongs.length} song{parsedSongs.length !== 1 ? 's' : ''} parsed
                  </span>
                </div>

                <div className="admin-csv-card-list">
                  {parsedSongs.map((song, index) => (
                    <div key={index} className={`song-import-card ${song.errors.length > 0 ? 'admin-csv-song-card--error' : 'admin-csv-song-card--valid'}`}>
                        {/* Header Section */}
                        <div className="song-import-header">
                          <div className="song-import-titles">
                            <h3 className="song-import-performer">{song.performer || 'Not specified'}</h3>
                            <h4 className="song-import-title">{song.title || 'Not specified'}</h4>
                          </div>
                          <div className={`song-import-status ${song.errors.length === 0 ? 'song-import-status--valid' : 'song-import-status--error'}`}>
                            {song.errors.length === 0 ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            <span>{song.errors.length === 0 ? 'Valid' : 'Error'}</span>
                          </div>
                        </div>

                        {/* Performer Banner */}
                        <div className="song-import-performer-banner">
                          <div className="asset-placeholder asset-placeholder--banner">
                            <ImagePlus size={20} />
                            <span className={`asset-status ${song.hasAsset ? 'asset-status--found' : 'asset-status--missing'}`}>
                              Performer Banner
                            </span>
                          </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="song-import-content">
                          {/* Left Column - Album Cover */}
                          <div className="song-import-album-cover">
                            <div className="asset-placeholder asset-placeholder--cover">
                              <ImagePlus size={32} />
                              <span className={`asset-status ${song.hasAsset ? 'asset-status--found' : 'asset-status--missing'}`}>
                                Album Cover
                              </span>
                            </div>
                          </div>

                          {/* Center Column - Song Details */}
                          <div className="song-import-details">
                            <div className="song-import-album-title">
                              {song.album || 'No album specified'}
                            </div>
                            
                            <div className="song-import-metadata">
                              <div className="metadata-row">
                                <span className="metadata-label">Release Year:</span>
                                <span className="metadata-value">{song.releaseYear || 'Not specified'}</span>
                              </div>
                              <div className="metadata-row">
                                <span className="metadata-label">City of Origin:</span>
                                <span className="metadata-value">{song.cityOfOrigin || 'Not specified'}</span>
                              </div>
                              <div className="metadata-row">
                                <span className="metadata-label">Record Label:</span>
                                <span className="metadata-value">{song.recordLabel || 'Not specified'}</span>
                              </div>
                              <div className="metadata-row">
                                <span className="metadata-label">Active Since:</span>
                                <span className="metadata-value">{song.activeSince || 'Not specified'}</span>
                              </div>
                              <div className="metadata-row">
                                <span className="metadata-label">Genres:</span>
                                <span className="metadata-value">{song.genre || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Song Cover */}
                          <div className="song-import-song-cover">
                            <div className="asset-placeholder asset-placeholder--cover">
                              <ImagePlus size={32} />
                              <span className={`asset-status ${song.hasAsset ? 'asset-status--found' : 'asset-status--missing'}`}>
                                Song Cover
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Banners */}
                        <div className="song-import-bottom-banners">
                          <div className="asset-placeholder asset-placeholder--banner">
                            <ImagePlus size={20} />
                            <span className={`asset-status ${song.hasAsset ? 'asset-status--found' : 'asset-status--missing'}`}>
                              Song Banner
                            </span>
                          </div>
                          <div className="asset-placeholder asset-placeholder--banner">
                            <ImagePlus size={20} />
                            <span className={`asset-status ${song.hasAsset ? 'asset-status--found' : 'asset-status--missing'}`}>
                              Album Banner
                            </span>
                          </div>
                        </div>

                        {/* Error Section */}
                        {song.errors.length > 0 && (
                          <div className="song-import-errors">
                            {song.errors.map((error, errorIndex) => (
                              <div key={errorIndex} className="error-message">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}