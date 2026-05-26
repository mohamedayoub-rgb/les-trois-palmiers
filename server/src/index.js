require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const CURRENCY = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

/* -------------------- STRIPE WEBHOOK --------------------
 * MUST be registered with the raw body parser BEFORE express.json(),
 * because signature verification needs the unparsed request body.
 */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (event.type === 'checkout.session.completed' && bookingId) {
      // Idempotent: only the first delivery (status still 'pending') flips + emails.
      const result = await prisma.booking.updateMany({
        where: { id: bookingId, status: 'pending' },
        data: { status: 'confirmed' }
      });

      if (result.count === 1) {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { room: true }
        });
        await sendMailSafe({
          to: booking.email,
          subject: '✅ Payment Received - Booking Confirmed | Les Trois Palmiers',
          html: `
            <h2>Hello ${booking.fullName},</h2>
            <p>Your payment was received and your booking is now <b>confirmed</b> 🎉</p>
            <h3>Details:</h3>
            <p><b>Room:</b> ${booking.room.name}</p>
            <p><b>Check-in:</b> ${booking.checkIn.toDateString()}</p>
            <p><b>Check-out:</b> ${booking.checkOut.toDateString()}</p>
            <p><b>Guests:</b> ${booking.guests}</p>
            <p>We look forward to welcoming you.</p>
          `
        });
      }
    }

    if (event.type === 'checkout.session.expired' && bookingId) {
      // Free the room if the customer abandoned an unpaid checkout.
      await prisma.booking.updateMany({
        where: { id: bookingId, status: 'pending' },
        data: { status: 'cancelled' }
      });
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    // Returning 500 makes Stripe retry; safe because the handler is idempotent.
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
});

app.use(express.json());

/* -------------------- EMAIL SETUP -------------------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send mail without letting a delivery failure break the request flow.
const sendMailSafe = async (options) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, ...options });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
    await sendMailSafe({
      to: process.env.ADMIN_EMAIL,
      subject: "🏨 New Booking Received (awaiting payment)",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Room:</b> ${room.name}</p>
        <p><b>Check-in:</b> ${checkIn}</p>
        <p><b>Check-out:</b> ${checkOut}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Request:</b> ${specialRequest || 'None'}</p>
      `
    });

    /* -------------------- EMAIL CUSTOMER (pending payment) -------------------- */
    await sendMailSafe({
      to: email,
      subject: "Booking Received - Payment Required | Les Trois Palmiers",
      html: `
        <h2>Hello ${fullName},</h2>
        <p>We've received your booking request. It will be <b>confirmed once payment is completed</b>.</p>

        <h3>Details:</h3>
        <p><b>Room:</b> ${room.name}</p>
        <p><b>Check-in:</b> ${checkIn}</p>
        <p><b>Check-out:</b> ${checkOut}</p>
        <p><b>Guests:</b> ${guests}</p>

        <p>If you closed the payment window before paying, please contact us to complete your payment.</p>
      `
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/* -------------------- STRIPE CHECKOUT -------------------- */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId is required' });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true }
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking is not awaiting payment' });
    }

    // Price is derived server-side from the room — never trust a client-sent amount.
    const nights = Math.max(1, Math.round((booking.checkOut - booking.checkIn) / MS_PER_DAY));
    const unitAmount = Math.round(booking.room.price * 100); // smallest currency unit

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.email,
      line_items: [{
        quantity: nights,
        price_data: {
          currency: CURRENCY,
          unit_amount: unitAmount,
          product_data: {
            name: `${booking.room.name} — ${nights} night${nights > 1 ? 's' : ''}`
          }
        }
      }],
      metadata: { bookingId: booking.id },
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/reservation`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60 // 30 min (Stripe minimum)
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: 'Failed to start payment' });
  }
});

// Public verification for the success page. Returns minimal, non-PII data only.
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const bookingId = session.metadata?.bookingId;

    const booking = bookingId
      ? await prisma.booking.findUnique({ where: { id: bookingId }, include: { room: true } })
      : null;

    res.json({
      paid: session.payment_status === 'paid',
      status: booking?.status || 'unknown',
      roomName: booking?.room?.name || null,
      checkIn: booking?.checkIn || null,
      checkOut: booking?.checkOut || null
    });
  } catch (error) {
    console.error('Session verify error:', error);
    res.status(400).json({ error: 'Invalid session' });
  }
});

/* -------------------- ADMIN BOOKING ROUTES -------------------- */
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
    const { name, email, subject, message } = req.body;

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message }
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

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* -------------------- CLEAN EXIT -------------------- */
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});