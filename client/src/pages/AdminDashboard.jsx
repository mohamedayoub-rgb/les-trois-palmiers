import { useEffect, useMemo, useState } from 'react';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../api';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

    return { total, pending, confirmed, cancelled };
  }, [bookings]);

  const handleStatusChange = async (id, status) => {
    try {
      setActionLoading(`${id}-${status}`);
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmed) return;

    try {
      setActionLoading(`${id}-delete`);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete booking.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#081225] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-10">
          <p className="text-gold-400 uppercase tracking-[0.25em] text-xs mb-3">
            Hotel Management
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-300 max-w-2xl">
                Manage reservations, confirm guest stays, and keep full control of your luxury hotel bookings.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm mb-2">Total Bookings</p>
            <h2 className="text-3xl font-semibold">{stats.total}</h2>
          </div>

          <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6 backdrop-blur-sm">
            <p className="text-yellow-200 text-sm mb-2">Pending</p>
            <h2 className="text-3xl font-semibold text-yellow-100">{stats.pending}</h2>
          </div>

          <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-6 backdrop-blur-sm">
            <p className="text-green-200 text-sm mb-2">Confirmed</p>
            <h2 className="text-3xl font-semibold text-green-100">{stats.confirmed}</h2>
          </div>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 backdrop-blur-sm">
            <p className="text-red-200 text-sm mb-2">Cancelled</p>
            <h2 className="text-3xl font-semibold text-red-100">{stats.cancelled}</h2>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">Reservation List</h3>
            <p className="text-slate-400 text-sm mt-1">
              Review, approve, cancel, or delete bookings.
            </p>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                🏨
              </div>
              <h4 className="text-2xl font-semibold mb-2">No bookings yet</h4>
              <p className="text-slate-400">
                New reservations will appear here once guests submit the booking form.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-[#0b1830] p-5 lg:p-6 shadow-xl"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                        <h4 className="font-serif text-2xl text-white">
                          {booking.fullName}
                        </h4>
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status || 'pending'}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Room</p>
                          <p className="text-white font-medium">
                            {booking.room?.name || '—'}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Email</p>
                          <p className="text-white font-medium break-all">
                            {booking.email}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Phone</p>
                          <p className="text-white font-medium">{booking.phone}</p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Guests</p>
                          <p className="text-white font-medium">{booking.guests}</p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Check-In</p>
                          <p className="text-white font-medium">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-slate-400 mb-1">Check-Out</p>
                          <p className="text-white font-medium">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-white/5 p-4">
                        <p className="text-slate-400 mb-2 text-sm">Special Request</p>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {booking.specialRequest?.trim()
                            ? booking.specialRequest
                            : 'No special request provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="xl:w-56 flex xl:flex-col gap-3">
                      <button
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        disabled={actionLoading === `${booking.id}-confirmed`}
                        className="flex-1 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-3 font-medium transition"
                      >
                        {actionLoading === `${booking.id}-confirmed`
                          ? 'Approving...'
                          : 'Approve'}
                      </button>

                      <button
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        disabled={actionLoading === `${booking.id}-cancelled`}
                        className="flex-1 rounded-2xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white px-4 py-3 font-medium transition"
                      >
                        {actionLoading === `${booking.id}-cancelled`
                          ? 'Cancelling...'
                          : 'Cancel'}
                      </button>

                      <button
                        onClick={() => handleDelete(booking.id)}
                        disabled={actionLoading === `${booking.id}-delete`}
                        className="flex-1 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-3 font-medium transition"
                      >
                        {actionLoading === `${booking.id}-delete`
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;