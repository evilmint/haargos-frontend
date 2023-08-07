import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Auth0Provider } from '@auth0/auth0-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Haargos - HomeAssistant Monitoring Tool',
  description: 'Monitor your client instances with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
