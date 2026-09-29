import { useEffect, useRef, useState } from 'react';

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchPanel({ open, onClose }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const panel = document.getElementById('searchPanel');
      const toggle = document.getElementById('searchToggle');
      if (panel && toggle && !panel.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open, onClose]);

  return (
    <div
      className={`search-panel ${open ? 'is-active' : ''}`}
      id="searchPanel"
      role="region"
      aria-label="Site Search"
      hidden={!open}
    >
      <div className="search-panel__content">
        <div className={`search-panel__input-wrapper ${hasText ? 'has-text' : ''}`}>
          <span className="search-panel__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            className="search-panel__input"
            placeholder="Search"
            aria-label="Search site archives"
            ref={inputRef}
            onChange={(e) => setHasText(e.target.value.length > 0)}
          />
        </div>
      </div>
    </div>
  );
}
