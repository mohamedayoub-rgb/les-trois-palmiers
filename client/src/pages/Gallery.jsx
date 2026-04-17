const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', alt: 'Hotel Exterior' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', alt: 'Luxury Suite' },
  { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', alt: 'Pool' },
  { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', alt: 'Restaurant' },
  { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80', alt: 'Ocean View' },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', alt: 'Villa' },
  { src: 'https://images.unsplash.com/photo-1571003123894-1f0598d2b795?w=800&q=80', alt: 'Spa' },
  { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80', alt: 'Bedroom' },
  { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80', alt: 'Lobby' },
  { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', alt: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80', alt: 'Suite' },
  { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', alt: 'Beach' }
];

function Gallery() {
  return (
    <div className="pt-24">
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold-400 uppercase tracking-widest text-sm mb-4">Discover</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Our Gallery</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Take a visual journey through the elegance and beauty of Les Trois Palmiers.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-serif text-lg">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;