'use client';

import { Toaster } from 'react-hot-toast';
import { Providers } from '@/providers';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DepotProvider } from '@/contexts/DepotContext';

// Crear la instancia del cliente fuera del componente
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <DepotProvider>
            <Providers>
              {children}
              <Toaster position="top-right" />
            </Providers>
          </DepotProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}