import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const config = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/',
  },
  callbacks: {
    async session({ session, token }) {
      const sessionToken = token?.sessionToken;
      const userData = await new Parse.Query(Parse.Session)
        .equalTo('sessionToken', sessionToken)
        .include('user')
        .first({ useMasterKey: true })
        .catch(e => console.error(e));
      if (!userData) return null;
      Object.assign(session, userData.get('user').toJSON());
      session.expires = userData.toJSON().expiresAt?.iso;
      session.sessionToken = userData.toJSON().sessionToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sessionToken = user.sessionToken;
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;
        return Parse.User.logIn(email, password).then(user => user.toJSON());
      },
    }),
  ],
} as NextAuthOptions;

// Use it in server contexts
export function auth(...args) {
  return getServerSession(...args, config);
}
