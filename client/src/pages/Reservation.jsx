import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchRooms, createBooking } from '../api';

function Reservation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    roomId: searchParams.get('room') || '',
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    specialRequest: '',
  });

  useEffect(() => {
    fetchRooms()
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Failed to load rooms:', error);
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const checkInDate = formData.checkIn ? new Date(formData.checkIn) : null;
    const checkOutDate = formData.checkOut ? new Date(formData.checkOut) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.roomId) newErrors.roomId = 'Please select a room';
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';

    if (checkInDate && checkInDate < today) {
      newErrors.checkIn = 'Check-in cannot be in the past';
    }

    if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }

    if (!formData.guests || Number(formData.guests) < 1) {
      newErrors.guests = 'At least 1 guest required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    setErrors({});

    try {
      const payload = {
        roomId: formData.roomId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
        specialRequest: formData.specialRequest?.trim() || '',
      };

      await createBooking(payload);

      setStatus('success');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setErrors({
        submit:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Booking failed. Please try again.',
      });
      setStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gray-200 h-96 loading-shimmer" />
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-green-50 border border-green-200 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-green-800 mb-2">Booking Requested!</h2>
            <p className="text-green-700 mb-6">
              Thank you for your reservation request. We&apos;ll confirm your booking via email shortly.
            </p>
            <Link to="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold-400 uppercase tracking-widest text-sm mb-4">Reservations</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Book Your Stay</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Complete the form below to reserve your dream getaway at Les Trois Palmiers.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Room *</label>
                <select
                  name="roomId"
                  required
                  className="input-field"
                  value={formData.roomId}
                  onChange={handleChange}
                >
                  <option value="">Choose a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - ${room.price}/night
                    </option>
                  ))}
                </select>
                {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="input-field"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                  <select
                    name="guests"
                    required
                    className="input-field"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date *</label>
                  <input
                    name="checkIn"
                    type="date"
                    required
                    className="input-field"
                    value={formData.checkIn}
                    onChange={handleChange}
                  />
                  {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date *</label>
                  <input
                    name="checkOut"
                    type="date"
                    required
                    className="input-field"
                    value={formData.checkOut}
                    onChange={handleChange}
                  />
                  {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  name="specialRequest"
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Any dietary requirements, special occasions, or preferences..."
                  value={formData.specialRequest}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full disabled:opacity-50"
              >
                {status === 'loading' ? 'Processing...' : 'Complete Reservation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reservation;