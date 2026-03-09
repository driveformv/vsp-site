import StickyNav from '@/components/layout/StickyNav';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import Footer from '@/components/layout/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StickyNav />
      <main className="min-h-screen pt-[72px] pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
