import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  videoUrl?: string;
  children?: ReactNode;
  /** Full viewport height (homepage). Default: compact banner. */
  fullHeight?: boolean;
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  videoUrl,
  children,
  fullHeight = false,
}: PageHeroProps) {
  // Full-screen hero: 100svh (accounts for mobile browser chrome)
  // Compact hero (subpages): fixed height that clears the nav
  const sectionClass = fullHeight
    ? 'relative w-full overflow-hidden bg-black h-[100svh]'
    : 'relative w-full overflow-hidden bg-black';

  // Compact hero needs explicit min-height to hold title+subtitle
  const sectionStyle = fullHeight
    ? undefined
    : { minHeight: '280px' };

  // Nav heights: mobile 72px (logo 56 + py 16), md+ 116px (logo 64 + py 24 + red bar 28)
  const contentClass = fullHeight
    ? 'relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-center px-6 pt-[72px] pb-12 text-center md:pt-[116px]'
    : 'relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-center px-6 pt-[72px] pb-10 text-center md:pt-[116px] md:pb-12';

  return (
    <section className={sectionClass} style={sectionStyle}>
      {/* Background media */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {backgroundImage && !videoUrl && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className={contentClass}>
        <h1
          className="text-3xl font-bold uppercase tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 text-base font-medium uppercase tracking-wide text-white/90 md:text-xl lg:text-2xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-10 flex flex-wrap items-center justify-center gap-4">{children}</div>}
      </div>
    </section>
  );
}
