'use effect';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type RedirectProps = {
  children: ReactNode;
};

export function RedirectProvider(props: RedirectProps) {
  const { getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (
        window.location.pathname == '/' ||
        window.location.pathname.startsWith('/signup') ||
        window.location.pathname.startsWith('/about')
      )
        return;

      try {
        await getAccessTokenSilently();
      } catch {
        router.push('/');
      }
    };
    check();
  }, [getAccessTokenSilently]);

  return props.children;
}
