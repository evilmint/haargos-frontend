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
      if (window.location.pathname == '/') return;

      try {
        await getAccessTokenSilently();
      } catch {
        router.push('/');
      }
    };
    check();
  }, [window, getAccessTokenSilently]);

  return props.children;
}
