import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRooms } from '../api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-96 loading-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold-400 uppercase tracking-widest text-sm mb-4">Accommodations</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Our Rooms & Suites</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover our collection of beautifully appointed rooms and suites,
            each designed to provide the ultimate in comfort and luxury.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/rooms/${room.id}`} className="block">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-gold-600 text-white px-4 py-2 text-sm font-medium">
                      ${room.price} / night
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link to={`/rooms/${room.id}`}>
                    <h3 className="font-serif text-2xl mb-2 text-gray-900 group-hover:text-gold-600 transition-colors">
                      {room.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Up to {room.capacity} guests
                  </p>
                  <p className="text-gray-600 mb-6 line-clamp-2">{room.description}</p>
                  <div className="flex gap-4">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="btn-outline flex-1 text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/reservation?room=${room.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Rooms;