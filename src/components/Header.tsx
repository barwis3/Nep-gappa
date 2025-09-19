import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍜</span>
            <span className="text-2xl font-bold text-brand">Nep-gappa</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="btn btn-secondary text-sm">
              Panel Administratora
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}