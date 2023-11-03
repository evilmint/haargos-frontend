'use client';

import * as React from 'react';

import {
  useAccountStore,
  useInstallationStore,
  useUserStore,
} from '@/app/services/stores';
import { User } from '@/app/types';
import { FailureAlert } from '@/components/ui/failure-alert';
import { RegisterFormValues, registerFormSchema } from '@/lib/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
  children?: React.ReactNode;
  onRegister?: (user: User) => void;
}

export function RegisterForm({ children, ...params }: RegisterFormProps) {
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();
  const [alertOpen, setAlertOpen] = useState(false);
  const createAccount = useAccountStore(state => state.createAccount);
  const { setUser } = useUserStore(state => state);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, true);
    } catch (error) {
      console.log(error);
    }
  };

  const defaultValues: RegisterFormValues = {
    userFullName: '',
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  async function onSubmit(data: RegisterFormValues) {
    setUpdating(true);

    try {
      const accessToken = await getAccessTokenSilently();
      const user = await createAccount(accessToken, data.userFullName);
      setUser(user);

      if (user != null && params.onRegister != null) {
        params.onRegister(user);
      }

      asyncFetch();
    } catch (error) {
      setAlertOpen(true);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <FailureAlert title={'Failed to register'} openChange={setAlertOpen} open={alertOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="userFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Bob Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            Create
          </Button>
        </form>
      </Form>
    </FailureAlert>
  );
}
