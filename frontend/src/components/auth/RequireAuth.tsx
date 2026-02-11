'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock list of public routes
const PUBLIC_ROUTES = ['/login'];

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/login');
    }
    
    // Redirect logged-in users away from login page
    if (token && pathname === '/login') {
      router.replace('/'); // dashboard
    }
  }, [token, pathname, router]);

  // Show nothing while checking (or a loading spinner)
  if (!token && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
