'use client';

import { createInstallation } from '@/app/services/installations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/new-york/ui/dialog';
import { useAuth0 } from '@auth0/auth0-react';
import { Input } from '@/registry/new-york/ui/input';
import { useState } from 'react';
import { Installation } from '@/app/types';
import { Button } from '@/registry/new-york/ui/button';
import { useInstallationStore } from '@/app/services/stores';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/registry/default/ui/alert-dialog';

interface CreateInstallationFormProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onCreateInstallation?: (installation: Installation) => void;
}
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/registry/default/ui/form';
import { CreateInstallationFormValues, createInstallationFormSchema } from '@/lib/zod';

export function CreateInstallationForm({
  children,
  ...params
}: CreateInstallationFormProps) {
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();
  const [alertOpen, setAlertOpen] = useState(false);

  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, true);
    } catch (error) {
      console.log(error);
    }
  };

  const defaultValues: Partial<CreateInstallationFormValues> = {
    name: '',
    instance: '',
  };

  const form = useForm<CreateInstallationFormValues>({
    resolver: zodResolver(createInstallationFormSchema),
    defaultValues,
  });

  async function onSubmit(data: CreateInstallationFormValues) {
    setUpdating(true);

    try {
      const accessToken = await getAccessTokenSilently();
      const installation = await createInstallation(
        accessToken,
        data.instance ?? '',
        data.name,
      );

      if (installation != null && params.onCreateInstallation != null) {
        params.onCreateInstallation(installation);
      }

      asyncFetch();
      params.onOpenChange?.(false);
    } catch (error) {
      setAlertOpen(true);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <AlertDialog open={alertOpen}>
      <Dialog open={params.open} onOpenChange={params.onOpenChange}>
        {children}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create installation</DialogTitle>
            <DialogDescription>Add a new HomeAssistant installation</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Parents' Home" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is the name that will be displayed on your profile and in
                      emails.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instance URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://my.homeassistant.url" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the URL of your HomeAssistant instance. Leave blank if not
                      applicable.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUpdating}>Create</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Failed to create installation.</AlertDialogTitle>
          <AlertDialogDescription>
            We might have a hiccup! Try again or reach out to support via{' '}
            <strong>
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </a>
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAlertOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
