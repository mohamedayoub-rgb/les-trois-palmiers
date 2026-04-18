import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchRooms = () => api.get('/rooms').then((res) => res.data);
export const fetchRoom = (id) => api.get(`/rooms/${id}`).then((res) => res.data);
export const createBooking = (data) => api.post('/bookings', data).then((res) => res.data);
export const fetchBookings = () => api.get('/bookings').then((res) => res.data);
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status }).then((res) => res.data);
export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`).then((res) => res.data);
export const submitContact = (data) =>
  api.post('/contact', data).then((res) => res.data);
export const adminLogin = (data) =>
  api.post('/admin/login', data).then((res) => res.data);

export default api;