'use effect';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type RedirectProps = {
  children: ReactNode;
};

export function RedirectProvider(props: RedirectProps) {
  const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();


  console.log(JSON.stringify(user));

  useEffect(() => {
    console.log(`isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`)
    const check = async () => {
      if (
        window.location.pathname == '/' ||
        window.location.pathname.startsWith('/signup') ||
        window.location.pathname.startsWith('/about')
      )
        return;

      try {
        const token = await getAccessTokenSilently();
        console.log(token)
      } catch {
        router.push('/');
      }
    };
    check();
  }, [getAccessTokenSilently]);


  useEffect(() => {
    console.log(`isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`)
    const check = async () => {
      if (isLoading || !isAuthenticated) return;

      console.log('ready')
      const token = await getAccessTokenSilently();
      console.log(token)
    };
    check();
  }, [getAccessTokenSilently, isLoading, isAuthenticated]);

  return props.children;
}
