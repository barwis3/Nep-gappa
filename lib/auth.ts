import { NextRequest } from 'next/server';
import { config } from './config';

export function checkAdminAuth(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin_authed');
  return adminCookie?.value === 'true';
}

export function validatePassword(password: string): boolean {
  return password === config.adminPassword;
}