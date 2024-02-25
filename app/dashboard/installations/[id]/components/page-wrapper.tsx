'use client';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';

export function PageWrapper({
  installationId,
  children,
}: {
  installationId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-col">
      <div className="border-b">
        <div className="flex md:h-16 items-center px-4">
          <MainNav installationId={installationId} className="mx-6" />
          <div className="ml-auto flex flex-col md:flex-row items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  );
}
