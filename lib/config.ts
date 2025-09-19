export const config = {
  minPeople: parseInt(process.env.MIN_PEOPLE || '10'),
  adminPassword: process.env.ADMIN_PASSWORD || 'zmien-mnie',
  mailFrom: process.env.MAIL_FROM || 'nep-gappa@example.com',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
};