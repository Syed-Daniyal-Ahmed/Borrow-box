// auth.config.js
export const authConfig = {
  pages: {
    signIn: '/signin', // Redirect users to this page for sign-in
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/writepost') || nextUrl.pathname.startsWith('/post') || nextUrl.pathname.startsWith('/my-deliveries');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers (Google, GitHub, Credentials) here later
};