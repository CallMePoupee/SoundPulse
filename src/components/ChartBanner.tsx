interface ChartBannerProps {
  era?: string;
  bannerSrc?: string;
  variant?: 'chart' | 'song';
}

export default function ChartBanner({ era, bannerSrc, variant = 'chart' }: ChartBannerProps) {
  if (!bannerSrc) {
    return (
      <div
        className={variant === 'song' ? 'song-top' : 'chart-top'}
        role="region"
        aria-label={`${era ?? 'Chart'} banner`}
      >
        <div className="shell"></div>
      </div>
    );
  }

  return (
    <div
      className={variant === 'song' ? 'song-banner-img' : 'chart-banner-img'}
      role="region"
      aria-label={`${era ?? 'Chart'} banner`}
    >
      <img src={bannerSrc} alt={`${era ?? 'Chart'} banner`} />
    </div>
  );
}
