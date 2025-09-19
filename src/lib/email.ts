// Mock email service
export async function sendOrderConfirmation(order: any) {
  console.log('📧 Email: Order Confirmation')
  console.log(`To: ${order.customerEmail}`)
  console.log(`Subject: Potwierdzenie zamówienia #${order.id}`)
  console.log(`Body: Dziękujemy za złożenie zamówienia na ${order.deliveryDate} o ${order.deliveryTime}.`)
  console.log('---')
}

export async function sendOrderStatusUpdate(order: any) {
  console.log('📧 Email: Order Status Update')
  console.log(`To: ${order.customerEmail}`)
  console.log(`Subject: Zmiana statusu zamówienia #${order.id}`)
  console.log(`Body: Status Twojego zamówienia został zmieniony na: ${order.status}`)
  if (order.rejectionReason) {
    console.log(`Powód: ${order.rejectionReason}`)
  }
  console.log('---')
}

export async function sendAdminNotification(order: any) {
  console.log('📧 Email: New Order Notification (Admin)')
  console.log(`Subject: Nowe zamówienie #${order.id}`)
  console.log(`Body: Otrzymano nowe zamówienie od ${order.customerName} na ${order.deliveryDate}`)
  console.log('---')
}