export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4 text-brand-400">Kontakt</h4>
          <div className="space-y-2 text-gray-300">
            <p>📞 Telefon: +48 123 456 789</p>
            <p>📧 Email: kontakt@nep-gappa.pl</p>
            <p>📍 Adres: ul. Przykładowa 123, 00-000 Warszawa</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              © 2024 Nep-gappa. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}