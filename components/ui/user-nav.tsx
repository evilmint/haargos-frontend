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
import { AvatarIcon } from '@radix-ui/react-icons';

export function UserNav() {
  const fetchUser = useUserStore(state => state.fetchUser);
  const { getAccessTokenSilently, getIdTokenClaims, user, logout, isAuthenticated } = useAuth0();

  useEffect(() => {

    getAccessTokenSilently().then(token => {
      
      fetchUser(token);
    })
  }, [fetchUser, user, getAccessTokenSilently]);

  return isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
          <AvatarImage src={user?.picture} alt="@shadcn" />
            <AvatarFallback>{fullNameInitials(user)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{`${user?.name}`}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      
        <DropdownMenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (<LoginButton />);
}
