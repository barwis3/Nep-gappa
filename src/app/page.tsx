import { OrderForm } from '@/components/OrderForm'
import { Menu } from '@/components/Menu'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Zamów jedzenie na wybrany termin
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Wybierz z naszego menu i zamów jedzenie z dostawą na konkretną datę i godzinę
            </p>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Menu</h2>
            <Menu />
          </div>
        </section>

        {/* Order Form Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Złóż zamówienie</h2>
            <OrderForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}