import { useSearchParams } from 'react-router-dom';
import { createCheckoutSession } from '../api';

function Payment() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const handlePayment = async () => {
    try {
      const res = await createCheckoutSession({
        bookingId
      });

      window.location.href = res.url;
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-serif mb-4">Complete Payment</h1>
        <p className="mb-6 text-gray-600">
          Secure your reservation by completing the payment.
        </p>

        <button
          onClick={handlePayment}
          className="btn-primary w-full"
        >
          Pay Now 💳
        </button>
      </div>
    </div>
  );
}

export default Payment;