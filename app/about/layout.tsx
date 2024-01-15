import '@/app/globals.css';
import Footer from '@/components/footer';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import type { Metadata } from 'next';

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

export const metadata: Metadata = {
  title: 'Haargos - HomeAssistant Monitoring Tool',
  description: 'Monitor your client instances with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex-col sm:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      </div>

      {children}

      <Footer />
    </div>
  );
}
