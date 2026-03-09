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
    <section className="relative w-full overflow-hidden bg-black">
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
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center justify-center px-6 py-24 text-center md:py-32 lg:py-40">
        <h1
          className="text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-4 max-w-2xl text-lg font-light text-white/80 md:text-xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
      </div>
    </section>
  );
}
