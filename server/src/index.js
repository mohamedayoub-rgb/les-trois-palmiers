require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { available: true }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: { bookings: true }
    });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { fullName, email, phone, roomId, checkIn, checkOut, guests, specialRequest } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }
    if (!guests || guests < 1) {
      return res.status(400).json({ error: 'At least 1 guest is required' });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (guests > room.capacity) {
      return res.status(400).json({ error: `Maximum capacity for this room is ${room.capacity} guests` });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Room is not available for selected dates' });
    }

    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        specialRequest,
        status: 'pending'
      },
      include: { room: true }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.patch('/api/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: { room: true }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    res.status(201).json(contactMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
