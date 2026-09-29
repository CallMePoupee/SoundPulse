import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Download, CircleAlert as AlertCircle, CircleCheck as CheckCircle, X, Save } from 'lucide-react';
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

interface ValidationError {
  row: number;
  field: string;
  message: string;
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

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="admin-csv-processing">
              <div className="admin-spinner admin-spinner--small" />
              <span>Processing CSV data...</span>
            </div>
          )}

          {/* Validation Summary */}
          {showPreview && (
            <div className="admin-csv-summary">
              <div className="admin-csv-summary-stats">
                <div className="admin-csv-stat admin-csv-stat--success">
                  <CheckCircle size={16} />
                  <span>{validSongs.length} Valid Songs</span>
                </div>
                {invalidSongs.length > 0 && (
                  <div className="admin-csv-stat admin-csv-stat--error">
                    <AlertCircle size={16} />
                    <span>{invalidSongs.length} Invalid Songs</span>
                  </div>
                )}
              </div>
              
              {validSongs.length > 0 && (
                <button
                  type="button"
                  className="admin-button admin-button--primary"
                  onClick={handleImport}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="admin-spinner admin-spinner--small" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Import {validSongs.length} Songs
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Preview Table */}
          {showPreview && parsedSongs.length > 0 && (
            <div className="admin-csv-preview">
              <div className="admin-csv-preview-header">
                <h3>Preview</h3>
                <span className="admin-csv-preview-count">{parsedSongs.length} {parsedSongs.length === 1 ? 'row' : 'rows'}</span>
              </div>
              <div className="admin-csv-table-wrapper">
                <table className="admin-csv-table">
                  <thead>
                    <tr>
                      <th className="admin-csv-th-status">Status</th>
                      <th className="admin-csv-th-num">#</th>
                      <th>Song Title</th>
                      <th>Performer(s)</th>
                      <th>Album</th>
                      <th>Year</th>
                      <th>Label</th>
                      <th>Genre</th>
                      <th>Origin</th>
                      <th>Since</th>
                      <th>Assets</th>
                      <th className="admin-csv-th-errors">Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedSongs.map((song, index) => (
                      <tr key={index} className={`admin-csv-row ${song.errors.length > 0 ? 'admin-csv-row--error' : 'admin-csv-row--valid'}`}>
                        <td className="admin-csv-td-status">
                          <span className={`admin-csv-status-badge ${song.errors.length === 0 ? 'admin-csv-status-badge--valid' : 'admin-csv-status-badge--error'}`}>
                            {song.errors.length === 0 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            <span>{song.errors.length === 0 ? 'Valid' : `${song.errors.length} ${song.errors.length === 1 ? 'error' : 'errors'}`}</span>
                          </span>
                        </td>
                        <td className="admin-csv-td-num">{index + 1}</td>
                        <td className="admin-csv-td-title">{song.title || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.performer || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.album || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.releaseYear || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.recordLabel || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.genre || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.cityOfOrigin || <span className="admin-csv-empty">—</span>}</td>
                        <td>{song.activeSince || <span className="admin-csv-empty">—</span>}</td>
                        <td>
                          <span className={`admin-csv-asset ${song.hasAsset ? 'admin-csv-asset--found' : 'admin-csv-asset--missing'}`}>
                            {song.hasAsset ? 'Found' : 'Missing'}
                          </span>
                        </td>
                        <td className="admin-csv-td-errors">
                          {song.errors.length > 0 && (
                            <div className="admin-csv-errors">
                              {song.errors.map((error, errorIndex) => (
                                <div key={errorIndex} className="admin-csv-error">
                                  <AlertCircle size={11} className="admin-csv-error-icon" />
                                  <span>{error}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="admin-csv-card-list">
                {parsedSongs.map((song, index) => (
                  <div key={index} className={`admin-csv-card ${song.errors.length > 0 ? 'admin-csv-card--error' : 'admin-csv-card--valid'}`}>
                    <div className="admin-csv-card-header">
                      <span className={`admin-csv-status-badge ${song.errors.length === 0 ? 'admin-csv-status-badge--valid' : 'admin-csv-status-badge--error'}`}>
                        {song.errors.length === 0 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        <span>{song.errors.length === 0 ? 'Valid' : `${song.errors.length} ${song.errors.length === 1 ? 'error' : 'errors'}`}</span>
                      </span>
                      <span className="admin-csv-card-num">Row {index + 1}</span>
                    </div>
                    <div className="admin-csv-card-body">
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Song</span>
                        <span className="admin-csv-card-value">{song.title || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Performer</span>
                        <span className="admin-csv-card-value">{song.performer || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Album</span>
                        <span className="admin-csv-card-value">{song.album || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Year</span>
                        <span className="admin-csv-card-value">{song.releaseYear || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Label</span>
                        <span className="admin-csv-card-value">{song.recordLabel || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Genre</span>
                        <span className="admin-csv-card-value">{song.genre || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Origin</span>
                        <span className="admin-csv-card-value">{song.cityOfOrigin || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Since</span>
                        <span className="admin-csv-card-value">{song.activeSince || '—'}</span>
                      </div>
                      <div className="admin-csv-card-field">
                        <span className="admin-csv-card-label">Assets</span>
                        <span className={`admin-csv-asset ${song.hasAsset ? 'admin-csv-asset--found' : 'admin-csv-asset--missing'}`}>
                          {song.hasAsset ? 'Found' : 'Missing'}
                        </span>
                      </div>
                    </div>
                    {song.errors.length > 0 && (
                      <div className="admin-csv-card-errors">
                        {song.errors.map((error, errorIndex) => (
                          <div key={errorIndex} className="admin-csv-error">
                            <AlertCircle size={11} className="admin-csv-error-icon" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}