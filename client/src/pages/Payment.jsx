import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../api';

function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setError('Missing booking reference. Please start your reservation again.');
      return;
    }

    let cancelled = false;

    createCheckoutSession({ bookingId })
      .then(({ url }) => {
        if (cancelled) return;
        if (url) {
          // Hand off to Stripe's hosted, PCI-compliant checkout page.
          window.location.href = url;
        } else {
          setError('Could not start payment. Please try again.');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.response?.data?.error ||
            'Could not start payment. Please try again.'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {error ? (
          <>
            <h1 className="text-3xl font-serif text-red-600 mb-4">
              Payment could not start
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/reservation')}
              className="btn-primary"
            >
              Back to Reservation
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-serif mb-4">
              Redirecting to secure payment…
            </h1>
            <p className="text-gray-600">
              Please wait while we connect you to our payment provider.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;
