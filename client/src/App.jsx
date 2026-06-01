import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';

import Payment from './pages/Payment';
import Success from './pages/Success';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:id" element={<RoomDetail />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="reservation" element={<Reservation />} />

        {/* ✅ NEW ROUTES */}
        <Route path="payment" element={<Payment />} />
        <Route path="success" element={<Success />} />

      </Route>

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

    </Routes>
  );
}

export default App;