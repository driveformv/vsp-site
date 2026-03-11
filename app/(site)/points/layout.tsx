import MuiProvider from '@/components/MuiProvider';

export default function PointsLayout({ children }: { children: React.ReactNode }) {
  return <MuiProvider>{children}</MuiProvider>;
}
