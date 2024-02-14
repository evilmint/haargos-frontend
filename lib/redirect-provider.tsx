'use effect';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useHaargosRouter } from './haargos-router';

type RedirectProps = {
  children: ReactNode;
};

export function RedirectProvider(props: RedirectProps) {
  const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
  const router = useHaargosRouter(useRouter());

  useEffect(() => {
    const check = async () => {
      if (isLoading) return;

      if (
        window.location.pathname == '/' ||
        window.location.pathname.startsWith('/signup') ||
        window.location.pathname.startsWith('/about')
      )
        return;

      try {
        await getAccessTokenSilently();
      } catch {
        router.navigateToRoot();
      }
    };
    check();
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  return props.children;
}
