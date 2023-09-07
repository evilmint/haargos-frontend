'use client';

import { Separator } from '@/registry/default/ui/separator';
import { DeleteAccountForm } from './components/delete-account-form';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Delete account</h3>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete your account? This action is irreversible.
        </p>
      </div>
      <Separator />
      <DeleteAccountForm />
    </div>
  );
}
