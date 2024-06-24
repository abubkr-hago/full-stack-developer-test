'use server';

import { redirect } from 'next/navigation';
import { auth } from '../../config/auth';

export async function signup(prevState: any, formData: FormData) {
  const { email, password, first_name, last_name } = Object.fromEntries(formData.entries());
  return Parse.User.signUp(email as string, password as string, { email, first_name, last_name })
    .then(() => ({ success: true, email }))
    .catch(e => ({ error: { code: e.code, message: e.message } }));
}

export async function changePassword(prevState: any, formData: FormData) {
  const authData = await auth();
  const sessionToken = authData?.sessionToken;
  const { old_password, new_password } = Object.fromEntries(formData.entries());
  return Parse.Cloud.run('changePassword', { old_password, new_password }, { sessionToken })
    .then(o => o.toJSON())
    .catch(e => ({ error: { code: e.code, message: e.message } }));
}

export async function updateUser(prevState: any, formData: FormData) {
  const session = await auth();
  const sessionToken = session?.sessionToken;
  if (!sessionToken) return redirect('/login');
  const { first_name, last_name, email, phone, city, country } = Object.fromEntries(
    formData.entries()
  );
  return new Parse.Query(Parse.User)
    .equalTo('objectId', session.objectId)
    .first({ sessionToken })
    .then(user =>
      user.save({ first_name, last_name, email, phone, city, country }, { sessionToken })
    )
    .then(user => user.toJSON())
    .catch(e => ({ error: { code: e.code, message: e.message } }));
}

export async function addToCart(prevState: any, formData: FormData) {
  const session = await auth();
  const sessionToken = session?.sessionToken;
  if (!sessionToken) return redirect('/login');
  const objectId = formData.get('objectId');
  const product = await new Parse.Query('Product')
    .equalTo('objectId', objectId)
    .first({ sessionToken })
    .catch(e => ({ code: e.code, message: e.message }));
  return new Parse.Object('Cart')
    .save({ product }, { sessionToken })
    .then(cart => cart.toJSON())
    .catch(e => ({ error: { code: e.code, message: e.message } }));
}
