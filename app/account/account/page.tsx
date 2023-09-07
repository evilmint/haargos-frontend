'use client';

import { Separator } from '@/registry/default/ui/separator';
import { AccountForm } from './components/account-form';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
