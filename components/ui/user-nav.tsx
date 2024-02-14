'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/ui/avatar';
import { Button } from '@/registry/new-york/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/new-york/ui/dropdown-menu';

import { UserDoesNotExistError, useUserStore } from '@/app/services/stores/user';
import { fullNameInitials } from '@/app/tools';
import { useHaargosRouter } from '@/lib/haargos-router';
import { TierResolver } from '@/lib/tier-resolver';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { Badge } from '@tremor/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoginButton } from './login-button';

function daysUntil(dateString: string): number {
  const now = new Date(); // Current date and time
  const targetDate = new Date(dateString); // Date to check against

  // Calculate the difference in milliseconds
  const difference = targetDate.getTime() - now.getTime();

  // Convert milliseconds to days (1000 ms / second, 60 seconds / minute, 60 minutes / hour, 24 hours / day)
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return days;
}

export function UserNav() {
  const { fetchUser, user: apiUser } = useUserStore(state => state);
  const { getAccessTokenSilently, user, logout, isAuthenticated } = useAuth0();
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useHaargosRouter(useRouter());

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchUser(token);
    } catch (error: any) {
      if (error instanceof UserDoesNotExistError) {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchUser, getAccessTokenSilently, user]);

  const isLowTier = apiUser?.tier == 'Explorer' || apiUser?.tier == 'Expired';
  let tierBadgeColor = TierResolver.badgeColor(apiUser?.tier ?? 'Expired');

  const daysLeftToSubscriptionEnd = apiUser?.subscription?.expires_on
    ? daysUntil(apiUser.subscription.expires_on)
    : -1;
  const isSubscriptionEnding = apiUser?.subscription?.expires_on
    ? daysUntil(apiUser.subscription.expires_on) < 14
    : false;

  const isSubscriptionWarningVisible = isSubscriptionEnding || apiUser?.tier == 'Expired';

  let subscriptionWarningText: string = '';

  if (apiUser?.tier == 'Expired') {
    subscriptionWarningText = 'Subscription expired';
  } else if (isSubscriptionEnding) {
    subscriptionWarningText = `Subscription ending in ${daysLeftToSubscriptionEnd} day${
      daysLeftToSubscriptionEnd == 1 ? '' : 's'
    }`;
  }

  return isLoading ? (
    <></>
  ) : isAuthenticated && apiUser ? (
    <>
      <Link
        className={cn(
          isSubscriptionWarningVisible ? 'hidden md:block' : 'hidden',
          'cursor-pointer',
        )}
        href="/#pricing"
      >
        <Badge className="cursor-pointer" color="red">
          {subscriptionWarningText}
        </Badge>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.picture} alt="@shadcn" />
              <AvatarFallback>{fullNameInitials(apiUser?.full_name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{`${
                apiUser.full_name.trim().length > 0 ? apiUser.full_name : apiUser.email
              }`}</p>
              {apiUser.full_name.trim().length == 0 ? (
                <></>
              ) : (
                <p className="text-xs leading-none text-muted-foreground">
                  {apiUser.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>

          <Badge color={tierBadgeColor} className="ml-2">
            {apiUser.tier}
          </Badge>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.navigateToAccount()}>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isLowTier ? 'font-semibold' : ''}
              onClick={() => router.navigateToHomePageSection('pricing')}
            >
              Upgrade
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <>
      <Link className={cn(buttonVariants({ variant: 'secondary' }), '')} href="/signup">
        Sign up
      </Link>
      <LoginButton />
    </>
  );
}
