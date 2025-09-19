import './globals.css';

export const metadata = {
  title: 'Nep-gappa - Catering',
  description: 'Aplikacja do składania i obsługi zamówień cateringowych',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <img src="/logo.svg" alt="Nep-gappa" className="h-8" />
                </div>
                <nav className="flex items-center space-x-6">
                  <a
                    href="/"
                    className="text-gray-700 hover:text-brand-500 font-medium"
                  >
                    Złóż zamówienie
                  </a>
                  <a
                    href="/admin"
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Panel admina
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 Nep-gappa. Wszystkie prawa zastrzeżone.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}