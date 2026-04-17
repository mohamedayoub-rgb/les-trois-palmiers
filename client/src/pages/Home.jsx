import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      icon: '🏨',
      title: 'Luxury Suites',
      description: 'World-class accommodations with Mediterranean views'
    },
    {
      icon: '🍽️',
      title: 'Fine Dining',
      description: 'Michelin-starred restaurant on-site'
    },
    {
      icon: '💆',
      title: 'Spa & Wellness',
      description: 'Rejuvenating treatments and thermal baths'
    },
    {
      icon: '🏊',
      title: 'Infinity Pool',
      description: 'Heated pool overlooking the ocean'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 animate-fade-in">
            Les Trois Palmiers
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wider mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Where Luxury Meets the Mediterranean
          </p>
          <Link
            to="/rooms"
            className="inline-block btn-primary animate-slide-up"
            style={{ animationDelay: '0.6s' }}
          >
            Explore Our Rooms
          </Link>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
                alt="Hotel Interior"
                className="r shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-gold-600 text-white p-8 hidden md:block">
                <p className="font-serif text-4xl">25+</p>
                <p className="uppercase tracking-widest text-sm">Years of Excellence</p>
              </div>
            </div>
            <div>
              <p className="text-gold-600 uppercase tracking-widest text-sm mb-4">Welcome to Les Trois Palmiers</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-gray-900">
                A Legacy of Luxury Since 1998
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Nestled along the pristine Côte d'Azur, Les Trois Palmiers has been a beacon of 
                refined elegance for over two decades. Our boutique hotel combines timeless 
                French sophistication with modern comforts, offering an unparalleled retreat for 
                discerning travelers.
              </p>
              <Link to="/about" className="btn-outline">
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-4">Experience</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900">World-Class Amenities</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-serif text-xl mb-3 text-gray-900 group-hover:text-gold-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-4">Accommodations</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">Discover Our Rooms</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each room tells a story of refined elegance, featuring bespoke furnishings 
              and breathtaking views of the Mediterranean.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Royal Suite',
                price: '$850',
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'
              },
              {
                name: 'Deluxe Ocean View',
                price: '$450',
                image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'
              },
              {
                name: 'Garden Villa',
                price: '$1,200',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80'
              }
            ].map((room) => (
              <div key={room.name} className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-xl text-gray-900 group-hover:text-gold-600 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-gold-600 font-medium">From {room.price} / night</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/rooms" className="btn-outline">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80"
            alt="Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Begin Your Journey
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Book your stay today and experience the magic of Les Trois Palmiers.
          </p>
          <Link to="/reservation" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
            Reserve Your Stay
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;