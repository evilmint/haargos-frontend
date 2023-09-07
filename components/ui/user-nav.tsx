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

import { useUserStore } from '@/app/services/stores';
import React, { useEffect, useState } from 'react';
import { fullNameInitials } from '@/app/tools';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './login-button';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { fetchUser, user: apiUser } = useUserStore(state => state);
  const { getAccessTokenSilently, user, logout, isAuthenticated } = useAuth0();
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchUser(token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchUser, getAccessTokenSilently, user]);

  return isLoading ? (
    <></>
  ) : isAuthenticated ? (
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
            <p className="text-sm font-medium leading-none">{`${apiUser?.full_name}`}</p>
            <p className="text-xs leading-none text-muted-foreground">{apiUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/account/account')}>
            Account
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
  ) : (
    <LoginButton />
  );
}
