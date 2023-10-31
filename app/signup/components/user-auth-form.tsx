'use client';

import * as React from 'react';

import { useUserStore } from '@/app/services/stores';
import { SignUpButton } from '@/components/ui/login-button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const user = useUserStore(store => store.user);
  const auth0User = useAuth0().user;

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  React.useEffect(() => {
    if (auth0User?.email) {
      setIsLoading(true);

      // Register here
      // After registration redirect to main page I guess
    }
  }, [auth0User]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <SignUpButton
            disabled={isLoading}
            className={cn(buttonVariants({ variant: 'ghost' }))}
          />
        </div>
      </form>
    </div>
  );
}
