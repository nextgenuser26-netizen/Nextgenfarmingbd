import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '@/components/CartDrawer';
import Favicon from '@/components/Favicon';
import MaintenanceGuard from '@/components/MaintenanceGuard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nextgenfarmingbd - Natural and Pure Food',
  description: 'Nextgenfarmingbd provides the best quality natural and pure food across Bangladesh.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${bengali.variable}`}>
      <body suppressHydrationWarning className="font-sans">
        <Favicon />
        <AuthProvider>
          <CartProvider>
            <MaintenanceGuard>
              {children}
            </MaintenanceGuard>
            <CartDrawer />
            <Toaster position="bottom-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
