import '@/app/globals.css';
import type { Metadata } from 'next';
import { PageWrapper } from '../dashboard/installations/[id]/components/page-wrapper';

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
  return <PageWrapper>{children}</PageWrapper>;
}
