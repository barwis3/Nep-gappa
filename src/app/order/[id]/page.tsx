import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { OrderDetail } from '@/components/OrderDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

async function getOrder(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id }
    })
    return order
  } catch (error) {
    return null
  }
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <OrderDetail order={order} />
        </div>
      </main>

      <Footer />
    </div>
  )
}