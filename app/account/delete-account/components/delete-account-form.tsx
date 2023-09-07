'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/registry/new-york/ui/button';
import { Form } from '@/registry/new-york/ui/form';
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
  AlertDialogTrigger,
} from '@/registry/default/ui/alert-dialog';
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

  const [isDeleting, setDeleting] = useState(false);

  async function onSubmit(data: DeleteFormValues) {
    // setDeleting(true);
    // uncomment ^


    // TODO: First mock logging out

    // TODO: API call for deleting account DELETE /account
    // TODO: Log out
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  );
}
