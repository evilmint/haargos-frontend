'use client';

import { createInstallation } from '@/app/services/installations';
import { useInstallationStore } from '@/app/services/stores/installation';
import { Installation } from '@/app/types';
import { UpgradeTierError } from '@/lib/errors';
import { CreateInstallationFormValues, createInstallationFormSchema } from '@/lib/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/new-york/ui/dialog';
import { Input } from '@/registry/new-york/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FailureAlert } from './failure-alert';

interface CreateInstallationFormProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onCreateInstallation?: (installation: Installation) => void;
}

export function CreateInstallationForm({
  children,
  ...params
}: CreateInstallationFormProps) {
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDescription, setAlertDescription] = useState<string | undefined>(undefined);

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
      toast.success('Installation has been created.');
    } catch (error) {
      if (error instanceof UpgradeTierError) {
        setAlertDescription(
          'You have used up your installation limit.<br /><strong><a href="/#pricing">Upgrade now to benefit from Haargos even more!</a></strong>',
        );
      }
      setAlertOpen(true);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <FailureAlert
      title={'Failed to create installation.'}
      description={alertDescription}
      openChange={setAlertOpen}
      open={alertOpen}
    >
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
              <Button type="submit" disabled={isUpdating}>
                Create
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </FailureAlert>
  );
}
