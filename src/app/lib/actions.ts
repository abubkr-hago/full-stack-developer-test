'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  return Parse.User.logIn(email as string, password as string).then(
    user => {
      cookies().set('sessionToken', user.getSessionToken());
      redirect('/');
    },
    e => ({ code: e.code, message: e.message })
  );
}

export async function getSession() {
  const sessionToken = cookies().get('sessionToken')?.value;
  if (!sessionToken) return null;
  return new Parse.Query(Parse.Session)
    .equalTo('sessionToken', sessionToken)
    .first({ useMasterKey: true })
    .then(result => result.getSessionToken());
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const first_name = formData.get('first_name');
  const last_name = formData.get('last_name');
  const it = formData.values();
  const data = Object.fromEntries(formData.entries());
  console.log({ data });
  for (const value of it) console.log({ value });
  return Parse.User.signUp(email as string, password as string, { first_name, last_name })
    .then(user => {
      cookies().set('sessionToken', user.getSessionToken());
      redirect('/');
    })
    .catch(e => {
      return { code: e.code, message: e.message };
    });
}
