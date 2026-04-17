import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchRoom } from '../api';

function RoomDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const preSelectedRoom = searchParams.get('room');

  useEffect(() => {
    if (preSelectedRoom) {
      fetchRoom(preSelectedRoom)
        .then(setRoom)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (id) {
      fetchRoom(id)
        .then(setRoom)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, preSelectedRoom]);

  if (loading) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gray-200 h-96 loading-shimmer" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Room not found</h2>
          <Link to="/rooms" className="btn-primary">
            Browse All Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="relative h-[60vh]">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">{room.name}</h1>
            <p className="text-xl text-gold-400">${room.price} / night</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="font-serif text-2xl mb-6">Room Description</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{room.description}</p>

              <h3 className="font-serif text-xl mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  'King Size Bed',
                  'Private Balcony',
                  'Marble Bathroom',
                  'Mini Bar',
                  'Room Service',
                  'Free Wi-Fi',
                  'Smart TV',
                  'Air Conditioning'
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>

              <h3 className="font-serif text-xl mb-4">Capacity</h3>
              <p className="text-gray-600 mb-8">This room can accommodate up to {room.capacity} guests.</p>
            </div>

            <div>
              <div className="bg-gray-50 p-8 sticky top-24">
                <h3 className="font-serif text-xl mb-6">Book This Room</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Price per night</p>
                    <p className="text-3xl font-serif text-gold-600">${room.price}</p>
                  </div>
                  <Link
                    to={`/reservation?room=${room.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Reserve Now
                  </Link>
                  <Link to="/rooms" className="btn-outline w-full text-center block">
                    Back to Rooms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoomDetail;