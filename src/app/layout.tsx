import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '🍜 Nep-gappa - System Zamówień Jedzenia',
  description: 'Zamów jedzenie na wybrany termin z naszego menu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}