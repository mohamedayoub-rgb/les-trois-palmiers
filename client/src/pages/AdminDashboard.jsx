import { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadBookings();
  }, [navigate]);

  const loadBookings = async () => {
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      loadBookings();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      loadBookings();
    } catch (error) {
      console.error('Failed to delete booking');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-200 h-96 loading-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl text-gold-700">
              Les Trois Palmiers
            </Link>
            <span className="text-gray-400">|</span>
            <span className="font-medium">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-gold-600 hover:underline">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="font-serif text-2xl">Bookings</h1>
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded ${
                  filter === status
                    ? 'bg-gold-600 text-white'
                    : 'bg-white text-gray-700 border'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{booking.fullName}</p>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                    <p className="text-sm text-gray-500">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{booking.room?.name}</p>
                    <p className="text-sm text-gray-500">{booking.guests} guests</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">In: {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p className="text-sm">Out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;