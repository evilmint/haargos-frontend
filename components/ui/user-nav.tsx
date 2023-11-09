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

import { UserDoesNotExistError, useUserStore } from '@/app/services/stores';
import { fullNameInitials } from '@/app/tools';
import { TierResolver } from '@/lib/tier-resolver';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { Badge } from '@tremor/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoginButton } from './login-button';

export function UserNav() {
  const { fetchUser, user: apiUser } = useUserStore(state => state);
  const { getAccessTokenSilently, user, logout, isAuthenticated } = useAuth0();
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  return isLoading ? (
    <></>
  ) : isAuthenticated && apiUser ? (
    <>
      <Link className={cn(apiUser.tier == 'Expired' ? 'hidden md:block' : '', 'cursor-pointer')} href="/#pricing">
        <Badge className='cursor-pointer' color="red">
          Subscription expired
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
            <DropdownMenuItem onClick={() => router.push('/account/account')}>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isLowTier ? 'font-semibold' : ''}
              onClick={() => router.push('/#pricing')}
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
