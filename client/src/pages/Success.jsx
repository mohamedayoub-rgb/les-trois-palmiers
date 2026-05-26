import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCheckoutSession } from '../api';

function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [state, setState] = useState('loading'); // loading | paid | unpaid | error
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setState('error');
      return;
    }

    getCheckoutSession(sessionId)
      .then((data) => {
        setDetails(data);
        setState(data.paid ? 'paid' : 'unpaid');
      })
      .catch(() => setState('error'));
  }, [sessionId]);

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {state === 'loading' && (
          <p className="text-gray-600">Verifying your payment…</p>
        )}

        {state === 'paid' && (
          <>
            <h1 className="text-4xl font-serif text-green-600 mb-4">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-700 mb-2">Your booking is confirmed.</p>
            {details?.roomName && (
              <p className="text-gray-600">
                {details.roomName}
                {details.checkIn && details.checkOut && (
                  <>
                    {' '}
                    · {new Date(details.checkIn).toLocaleDateString()} →{' '}
                    {new Date(details.checkOut).toLocaleDateString()}
                  </>
                )}
              </p>
            )}
            <Link to="/" className="btn-primary inline-block mt-6">
              Back to Home
            </Link>
          </>
        )}

        {state === 'unpaid' && (
          <>
            <h1 className="text-3xl font-serif text-amber-600 mb-4">
              Payment not completed
            </h1>
            <p className="text-gray-600 mb-6">
              We haven't received your payment yet. You can try again from the
              reservation page.
            </p>
            <Link to="/reservation" className="btn-primary inline-block">
              Back to Reservation
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="text-3xl font-serif text-red-600 mb-4">
              Could not verify payment
            </h1>
            <p className="text-gray-600 mb-6">
              Something went wrong verifying this session. If you were charged,
              please contact us.
            </p>
            <Link to="/" className="btn-primary inline-block">
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Success;
