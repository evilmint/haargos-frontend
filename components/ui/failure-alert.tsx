import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/registry/default/ui/alert-dialog';
import { ReactNode } from 'react';

type FailureAlertProps = {
  children: ReactNode;
  open?: boolean;
  title: string;
  openChange?: (isOpen: boolean) => void;
};

export function FailureAlert(props: FailureAlertProps) {
  return (
    <AlertDialog open={props.open}>
      {props.children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
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
          <AlertDialogCancel onClick={() => props.openChange?.(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
