// middleware.js
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Matcher allows you to filter Middleware to run on specific paths.
  // This regex excludes static files and api routes unless specified.
  matcher: ['/dashboard/:path*', '/profile/:path*','/post/:path*','/writepost/:path*'],
};