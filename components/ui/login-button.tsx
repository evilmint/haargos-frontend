import { Button } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

import { cn } from '@/lib/utils';
import { PrimaryButton } from '../primary-button';
type AuthButtonProps = {
  className?: string;
  disabled?: boolean;
};

export function LoginButton({ ...props }: AuthButtonProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <PrimaryButton
      className={cn(props.className, 'bg-sr-600 hover:bg-sr-700')}
      onClick={() => loginWithRedirect()}
    >
      Log In
    </PrimaryButton>
  );
}

export function SignUpButton({ ...props }: AuthButtonProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      disabled={props.disabled}
      className={cn(props.className, 'bg-sr-600')}
      onClick={() => loginWithRedirect()}
    >
      Sign Up
    </Button>
  );
}
