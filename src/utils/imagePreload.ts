import { PORTFOLIO_DATA } from '../data';
import { asset } from './asset';
import profileImg from '../../assets/profile.jpg';
import jastinImg from '../../assets/jastin.jpg';

/** Preload images and report progress (0–100). */
export function preloadImages(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))];
  if (unique.length === 0) return Promise.resolve();

  let loaded = 0;
  const bump = () => {
    loaded++;
    onProgress?.(loaded, unique.length);
  };

  return Promise.all(
    unique.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => {
            bump();
            resolve();
          }, 10000);

          img.onload = img.onerror = () => {
            clearTimeout(timer);
            bump();
            resolve();
          };
          img.src = url;
        })
    )
  ).then(() => undefined);
}

/** Prefetch a single image into the browser cache (non-blocking). */
export function prefetchImage(url: string): void {
  if (!url) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

/** URLs that should be ready before the site reveals. */
export function getCriticalImageUrls(): string[] {
  return [
    asset('/assets/profile.jpg'),
    asset('/assets/jastin.jpg'),
    asset('/assets/intern/1.jpg'),
    asset('/assets/cert/isu.png'),
  ];
}

/** Every image used across the portfolio (for preloader). */
export function getAllPortfolioImageUrls(): string[] {
  const urls: string[] = [profileImg, jastinImg];

  for (const exp of PORTFOLIO_DATA.experience) {
    const imgs = (exp as { images?: string[] }).images;
    if (imgs) urls.push(...imgs);
  }
  for (const project of PORTFOLIO_DATA.projects) {
    if (project.image) urls.push(project.image);
    if (project.images) urls.push(...project.images);
  }
  const edu = PORTFOLIO_DATA.education as {
    images?: string[];
    cumLaudeImage?: string;
    certifications?: { image?: string }[];
  };
  if (edu.images) urls.push(...edu.images);
  if (edu.cumLaudeImage) urls.push(edu.cumLaudeImage);
  edu.certifications?.forEach((c) => c.image && urls.push(c.image));

  return [...new Set(urls)];
}

/** Prefetch the next and previous carousel slides. */
export function prefetchCarouselNeighbors(images: string[], index: number): void {
  if (images.length <= 1) return;
  const prev = images[(index - 1 + images.length) % images.length];
  const next = images[(index + 1) % images.length];
  prefetchImage(prev);
  prefetchImage(next);
}
