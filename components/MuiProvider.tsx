'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}
