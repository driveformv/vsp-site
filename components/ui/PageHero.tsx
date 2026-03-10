import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  videoUrl?: string;
  children?: ReactNode;
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  videoUrl,
  children,
}: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ minHeight: '85vh' }}>
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
      <div className="relative z-10 mx-auto flex h-full min-h-[85vh] max-w-[1280px] flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-5xl font-bold uppercase tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 text-lg font-medium uppercase tracking-wide text-white/90 md:text-xl lg:text-2xl"
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
