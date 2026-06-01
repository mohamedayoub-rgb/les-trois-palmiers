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

  // 🔹 LOAD ROOMS
  useEffect(() => {
    fetchRooms()
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 VALIDATION
  const validateForm = () => {
    const newErrors = {};
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.roomId) newErrors.roomId = 'Please select a room';
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';

    if (formData.checkIn && checkInDate < today) {
      newErrors.checkIn = 'Check-in cannot be in the past';
    }

    if (formData.checkIn && formData.checkOut && checkInDate >= checkOutDate) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }

    if (!formData.guests || Number(formData.guests) < 1) {
      newErrors.guests = 'At least 1 guest required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 SUBMIT (FIXED REDIRECTION)
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

      // ✅ CREATE BOOKING
      const booking = await createBooking(payload);

      console.log("BOOKING CREATED:", booking); // DEBUG

      // ✅ FORCE REDIRECT TO PAYMENT
      if (booking && booking.id) {
        navigate(`/payment?bookingId=${booking.id}`);
      } else {
        throw new Error("Booking ID missing");
      }

    } catch (error) {
      console.error(error);

      setErrors({
        submit:
          error?.response?.data?.error ||
          error?.message ||
          'Booking failed. Please try again.',
      });

      setStatus('error');
    }
  };

  // 🔹 LOADING UI
  if (loading) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gray-200 h-96 loading-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-16 bg-gray-900 text-white text-center">
        <h1 className="text-5xl font-serif">Book Your Stay</h1>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">

          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ROOM */}
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Choose a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - ${room.price}
                </option>
              ))}
            </select>

            {/* NAME */}
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field"
            />

            {/* EMAIL */}
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />

            {/* PHONE */}
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />

            {/* DATES */}
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="input-field"
            />

            {/* GUESTS */}
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="input-field"
            />

            {/* SUBMIT */}
            <button className="btn-primary w-full">
              {status === 'loading' ? 'Processing...' : 'Continue to Payment'}
            </button>

          </form>
        </div>
      </section>
    </div>
  );
}

export default Reservation;