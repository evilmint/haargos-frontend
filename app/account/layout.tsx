import { Metadata } from 'next';
import Image from 'next/image';

import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import { Card, CardContent } from '@/registry/new-york/ui/card';
import { Separator } from '@/registry/new-york/ui/separator';
import { SidebarNav } from './components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/account/account',
  },
  {
    title: 'Delete account',
    href: '/account/delete-account',
    isDestructive: true,
  },
  //   {
  //     title: 'Appearance',
  //     href: '/examples/forms/appearance',
  //   },
  //   {
  //     title: 'Notifications',
  //     href: '/examples/forms/notifications',
  //   },
  //   {
  //     title: 'Display',
  //     href: '/examples/forms/display',
  //   },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex-col">
      <div className="border-b">
        <div className="flex md:h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-2  2xl:w-3/5 mx-auto space-y-4 p-8 pt-6">
        <div className="md:hidden">
          <Image
            src="/examples/forms-light.png"
            width={1280}
            height={791}
            alt="Forms"
            className="block dark:hidden"
          />
          <Image
            src="/examples/forms-dark.png"
            width={1280}
            height={791}
            alt="Forms"
            className="hidden dark:block"
          />
        </div>
        <Card className="col-span-7">
          <CardContent>
            <div className="hidden space-y-6 p-10 pb-16 md:block">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account settings and set e-mail preferences.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                  <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
