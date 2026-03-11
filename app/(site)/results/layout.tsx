import MuiProvider from '@/components/MuiProvider';

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <MuiProvider>{children}</MuiProvider>;
}
