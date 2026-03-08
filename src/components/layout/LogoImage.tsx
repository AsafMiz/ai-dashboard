'use client';

const FALLBACK = '/communi-logo.webp';

export function LogoImage({ src, className }: { src?: string | null; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK}
      alt=""
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
    />
  );
}
