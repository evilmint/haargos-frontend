'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { useUserStore } from '@/app/services/stores';
import { useEffect } from 'react';

const profileFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function AccountForm() {
  const user = useUserStore(state => state.user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const defaultValues: Partial<ProfileFormValues> = {
      email: user?.email ?? '',
    };
    form.reset(defaultValues);
  }, [user]);

  function onSubmit(data: ProfileFormValues) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled={true} placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={true}>
          Update
        </Button>
      </form>
    </Form>
  );
}
