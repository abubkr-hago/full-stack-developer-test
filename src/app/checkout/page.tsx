'use server';
import Checkout from '../components/Checkout';
import { auth } from '../../config/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  const sessionToken = session?.sessionToken;
  const cart = await new Parse.Query('Product')
    .find({ sessionToken })
    .then(p => p.map(o => o.toJSON()))
    .catch(e => redirect(`/error?${e.message}`));
  return <Checkout cart={cart} />;
}
