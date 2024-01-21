'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAccountStore } from '@/app/services/stores/account';

import { useUserStore } from '@/app/services/stores/user';
import { FailureAlert } from '@/components/ui/failure-alert';
import { Button } from '@/registry/new-york/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/new-york/ui/form';
import { Input } from '@/registry/new-york/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  full_name: z.string().max(32, 'Maximum length of 32.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function AccountForm() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { setUser, user } = useUserStore(state => state);
  const updateAccount = useAccountStore(state => state.updateAccount);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const defaultValues: Partial<ProfileFormValues> = {
      email: user?.email ?? '',
      full_name: user?.full_name ?? '',
    };
    form.reset(defaultValues);
  }, [user]);

  const { getAccessTokenSilently } = useAuth0();

  async function onSubmit(data: ProfileFormValues) {
    setIsUpdating(true);

    try {
      const token = await getAccessTokenSilently();
      await updateAccount(token, data);

      let newUser = user;
      if (newUser) {
        newUser.email = data.email;
        newUser.full_name = data.full_name;
        setUser(newUser);
      }
      toast.success('Account data has been updated.');
    } catch {
      setAlertOpen(true);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <FailureAlert
      title={'Failed to update account'}
      openChange={setAlertOpen}
      open={alertOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={true} {...field} />
                </FormControl>
                <FormDescription>
                  You can manage verified email addresses in your{' '}
                  <Link href="/examples/forms">email settings</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Display name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            Update
          </Button>
        </form>
      </Form>
    </FailureAlert>
  );
}
