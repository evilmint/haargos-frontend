import { Button } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

type AuthButtonProps = {
  className?: string;
  disabled?: boolean;
};

export function LoginButton({ ...props }: AuthButtonProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button className={props.className} onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
}

export function SignUpButton({ ...props }: AuthButtonProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      disabled={props.disabled}
      className={props.className}
      onClick={() => loginWithRedirect()}
    >
      Sign Up
    </Button>
  );
}
