'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  useAccountStore,
  useInstallationStore,
  useInstallationSwitcherStore,
  useUserStore,
} from '@/app/services/stores';
import { FailureAlert } from '@/components/ui/failure-alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/default/ui/alert-dialog';
import { Button } from '@/registry/new-york/ui/button';
import { Form } from '@/registry/new-york/ui/form';
import { useAuth0 } from '@auth0/auth0-react';
import { useRef, useState } from 'react';

const deleteFormSchema = z.object({});

type DeleteFormValues = z.infer<typeof deleteFormSchema>;

export function DeleteAccountForm() {
  const defaultValues: Partial<DeleteFormValues> = {};

  const formRef = useRef<any | null>(null);
  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues,
  });

  const { logout, getAccessTokenSilently } = useAuth0();
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const deleteAccount = useAccountStore(state => state.deleteAccount);
  const clearInstallationSwitcherStore = useInstallationSwitcherStore(
    state => state.clear,
  );
  const clearInstallationStore = useInstallationStore(state => state.clear);
  const clearUserStore = useUserStore(state => state.clear);

  async function onSubmit(_data: DeleteFormValues) {
    setIsDeleting(true);

    try {
      const token = await getAccessTokenSilently();
      await deleteAccount(token);
      clearInstallationSwitcherStore();
      clearInstallationStore();
      clearUserStore();
      await logout();
    } catch {
      setIsDeleting(false);
      setAlertOpen(true);
    }
  }

  return (
    <FailureAlert
      title={'Failed to delete account'}
      openChange={setAlertOpen}
      open={alertOpen}
    >
      <AlertDialog>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  installation and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.dispatchEvent(
                        new Event('submit', { cancelable: true, bubbles: true }),
                      );
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </Form>

        <AlertDialogTrigger asChild>
          <Button disabled={isDeleting}>Delete account</Button>
        </AlertDialogTrigger>
      </AlertDialog>
    </FailureAlert>
  );
}
