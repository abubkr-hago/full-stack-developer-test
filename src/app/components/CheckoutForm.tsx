import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const stripe = useStripe();
  const elements = useElements();
  const [state, setState] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get('pics');

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setState({ message: 'Payment succeeded!' });
          break;
        case 'processing':
          setState({ message: 'Your payment is processing.' });
          break;
        case 'requires_payment_method':
          setState({ error: { message: 'Your payment was not successful, please try again.' } });
          break;
        default:
          setState({ error: { message: 'Something went wrong.' } });
          break;
      }
    });
  }, [stripe]);
}
