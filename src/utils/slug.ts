export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function songPath(performer: string, album: string, song: string): string {
  return `/${slugify(performer)}/${slugify(album)}/${slugify(song)}`;
}

export function performerPath(performer: string): string {
  return `/${slugify(performer)}`;
}

export function albumPath(performer: string, album: string): string {
  return `/${slugify(performer)}/${slugify(album)}`;
}

export function songCoverSrc(performer: string, album: string, song: string): string {
  return `/covers/songs/cover-${slugify(performer)}-${slugify(album)}-${slugify(song)}.png`;
}

export function songBannerSrc(performer: string, album: string, song: string): string {
  return `/banners/songs/banner-${slugify(performer)}-${slugify(album)}-${slugify(song)}.png`;
}

export function albumCoverSrc(performer: string, album: string): string {
  return `/covers/albums/cover-${slugify(performer)}-${slugify(album)}.png`;
}

export function albumBannerSrc(performer: string, album: string): string {
  return `/banners/albums/banner-${slugify(performer)}-${slugify(album)}.png`;
}

export function performerCoverSrc(performer: string): string {
  return `/covers/performers/cover-${slugify(performer)}.png`;
}

export function performerBannerSrc(performer: string): string {
  return `/banners/performers/banner-${slugify(performer)}.png`;
}

export function chartBannerSrc(chartSlug: string): string {
  return `/banners/charts/banner-${slugify(chartSlug)}.png`;
}

export function pageBannerSrc(pageSlug: string): string {
  return `/banners/pages/banner-${slugify(pageSlug)}.png`;
}

export function honorBadgeSrc(honorSlug: string): string {
  return `/honors/honors-${slugify(honorSlug)}.png`;
}
