import { config } from './config';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailOptions) {
  // Mock email implementation - logs to console
  console.log('=== EMAIL SENT ===');
  console.log('From:', config.mailFrom);
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Body:', body);
  console.log('==================');
}

export async function sendOrderAcceptedEmail(email: string, orderId: string) {
  await sendEmail({
    to: email,
    subject: 'Zamówienie zostało zaakceptowane',
    body: `Twoje zamówienie #${orderId} zostało zaakceptowane. Zaczniemy przygotowywać potrawę zgodnie z ustalonym terminem.`,
  });
}

export async function sendOrderRejectedEmail(email: string, orderId: string, reason: string) {
  await sendEmail({
    to: email,
    subject: 'Zamówienie zostało odrzucone',
    body: `Niestety, Twoje zamówienie #${orderId} zostało odrzucone. Powód: ${reason}`,
  });
}

export async function sendOrderInDeliveryEmail(email: string, orderId: string) {
  await sendEmail({
    to: email,
    subject: 'Zamówienie w drodze',
    body: `Twoje zamówienie #${orderId} jest już w drodze. Spodziewaj się dostawy zgodnie z ustalonym terminem.`,
  });
}

export async function sendOrderDeliveredEmail(email: string, orderId: string) {
  await sendEmail({
    to: email,
    subject: 'Zamówienie dostarczone',
    body: `Twoje zamówienie #${orderId} zostało dostarczone. Dziękujemy za skorzystanie z naszych usług! Możesz teraz ocenić nasze usługi.`,
  });
}