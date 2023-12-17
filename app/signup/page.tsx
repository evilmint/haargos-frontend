'use client';

import Link from 'next/link';
import { UserAuthForm } from './components/user-auth-form';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '../services/stores';
import { RegisterForm } from './components/register-form';

export default function SignupPage() {
  const auth0User = useAuth0().user;

  const searchParams = useSearchParams();

  const router = useRouter();
  const user = useUserStore(store => store.user);
  const signup = !auth0User;
  const register = auth0User && !user;

  let createAccountText: string;

  const tier = searchParams.get('tier') ?? '';
  let tierName: string;

  switch (tier) {
    case 'explorer':
      createAccountText = 'Embark on the Explorer journey';
      tierName = 'Explorer';
      break;
    case 'navigator':
      createAccountText = 'Sail like a Navigator';
      tierName = 'Navigator';
      break;
    case 'pro':
      createAccountText = 'Go Pro: Unlock advanced features';
      tierName = 'Pro';
      break;
    case 'enterprise':
      createAccountText = 'Embrace Enterprise';
      tierName = 'Enterprise';
      break;
    default:
      createAccountText = 'Create an account';
      tierName = 'Sign Up';
  }

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative mb-12 md:mb-0 md:h-full h-[200px] flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-sr-600" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="block">
              <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), '')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Haargos
              </Link>

              <h1 className="ml-4 mt-6 font-semibold text-4xl">{tierName}</h1>
            </div>
          </div>
          <div className="relative z-20 mt-auto hidden lg:block">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Haargos: Centralized monitoring for multiple HomeAssistant instances.
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {signup && (
              <>
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {createAccountText}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Clicking Sign Up will be redirect you to our authentication provider
                    which will authenticate and bring you back here.
                  </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <Link
                    href="/about/terms"
                    target="_blank"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/about/privacy"
                    target="_blank"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}

            {register && (
              <>
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
                  <p className="text-sm text-muted-foreground">You are one step away</p>
                </div>
                <RegisterForm
                  onRegister={() => {
                    router.push('/dashboard');
                  }}
                />
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By registering, you agree to our{' '}
                  <Link
                    href="/about/terms"
                    target="_blank"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    target="_blank"
                    href="/about/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
