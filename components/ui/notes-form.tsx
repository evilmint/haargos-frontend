'use client';

import { updateInstallation } from '@/app/services/installations';
import { useInstallationStore } from '@/app/services/stores';
import { Installation } from '@/app/types';
import { NotesFormValues, notesFormSchema } from '@/lib/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/registry/new-york/ui/dialog';
import { Textarea } from '@/registry/new-york/ui/textarea';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FailureAlert } from './failure-alert';

interface NotesFormProps {
  children: React.ReactNode;
  installationId: string;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onUpdatedInstallation?: (installation: Installation) => void;
}

export function NotesForm({ children, ...params }: NotesFormProps) {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const { installationId } = params;
  const installations = useInstallationStore(state => state.installations);
  const installation = installations.find(i => i.id == installationId);

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

  useEffect(() => {
    const defaultValues: Partial<NotesFormValues> = {
      notes: installation?.notes ?? '',
    };
    form.reset(defaultValues);
  }, [installation]);

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(notesFormSchema),
  });

  async function onSubmit(data: NotesFormValues, installation: Installation) {
    setUpdating(true);

    try {
      const accessToken = await getAccessTokenSilently();
      // Update
      const updatedInstallation = await updateInstallation(
        accessToken,
        installation.id,
        installation.urls.instance?.url ?? '',
        installation.name,
        data.notes,
      );

      if (updatedInstallation != null && params.onUpdatedInstallation != null) {
        params.onUpdatedInstallation(updatedInstallation);
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
    installation && (
      <FailureAlert
        title={'Failed to update notes.'}
        openChange={setAlertOpen}
        open={alertOpen}
      >
        <Dialog open={params.open} onOpenChange={params.onOpenChange}>
          {children}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update notes</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => {
                  onSubmit(data, installation);
                })}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="This installation is the best..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
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
          </DialogContent>
        </Dialog>
      </FailureAlert>
    )
  );
}
