require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

/* -------------------- EMAIL SETUP -------------------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* -------------------- AUTH MIDDLEWARE -------------------- */
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

/* -------------------- HEALTH CHECK -------------------- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* -------------------- ROOMS -------------------- */
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

/* -------------------- BOOKING -------------------- */
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      roomId,
      checkIn,
      checkOut,
      guests,
      specialRequest
    } = req.body;

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
      return res.status(400).json({ error: 'At least 1 guest required' });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (guests > room.capacity) {
      return res.status(400).json({
        error: `Maximum capacity is ${room.capacity}`
      });
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
      return res.status(400).json({ error: 'Room not available for selected dates' });
    }

    /* -------------------- CREATE BOOKING -------------------- */
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

    /* -------------------- EMAIL ADMIN -------------------- */
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🏨 New Booking Received",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Room:</b> ${room.name}</p>
        <p><b>Check-in:</b> ${checkInDate.toDateString()}</p>
        <p><b>Check-out:</b> ${checkOutDate.toDateString()}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Request:</b> ${specialRequest || 'None'}</p>
      `
    });

    /* -------------------- EMAIL CUSTOMER -------------------- */
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Booking Confirmation",
      html: `
        <h2>Hello ${fullName}</h2>
        <p>Your booking has been received 🎉</p>

        <p><b>Room:</b> ${room.name}</p>
        <p><b>Check-in:</b> ${checkInDate.toDateString()}</p>
        <p><b>Check-out:</b> ${checkOutDate.toDateString()}</p>
        <p><b>Guests:</b> ${guests}</p>

        <p>We will contact you soon.</p>
      `
    });

    /* -------------------- CLEAN RESPONSE (IMPORTANT FIX) -------------------- */
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingId: booking.id,
      redirectUrl: `http://localhost:5173/payment/${booking.id}`
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/* -------------------- ADMIN ROUTES -------------------- */
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

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: { room: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

/* -------------------- CONTACT -------------------- */
app.post('/api/contact', async (req, res) => {
  try {
    const contact = await prisma.contactMessage.create({
      data: req.body
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/* -------------------- ADMIN LOGIN -------------------- */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.passwordHash);

    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, email: admin.email });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

/* -------------------- SERVER START -------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* -------------------- CLEAN EXIT -------------------- */
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});