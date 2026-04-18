import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      title: 'Elegant Accommodation',
      description: 'Refined rooms and suites designed for comfort, privacy, and timeless style.',
      image: '/images/room2.png',
    },
    {
      title: 'Indoor & Outdoor Pool Experience',
      description: 'Relax by the pool in a serene setting made for leisure and calm escapes.',
      image: '/images/pool1.png',
    },
    {
      title: 'Distinctive Moroccan Ambience',
      description: 'Authentic architecture, warm hospitality, and elegant interiors in every corner.',
      image: '/images/hallway1.png',
    },
    {
      title: 'Dining & Lounge Spaces',
      description: 'Beautiful social spaces to enjoy breakfast, conversation, and quiet evenings.',
      image: '/images/lounge1.png',
    },
  ];

  const roomPreview = [
    {
      name: 'Royal Suite',
      price: '$850',
      image: '/images/room2.png',
    },
    {
      name: 'Deluxe Room',
      price: '$450',
      image: '/images/room1.png',
    },
    {
      name: 'Signature Suite',
      price: '$650',
      image: '/images/room7.png',
    },
  ];

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/the-hotel.png"
            alt="Les Trois Palmiers exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <p className="text-gold-400 uppercase tracking-[0.35em] text-xs md:text-sm mb-5">
            Luxury Hotel Experience
          </p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
            Les Trois Palmiers
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-2xl text-white/90 leading-relaxed mb-10">
            A refined escape where elegant rooms, warm Moroccan character, and premium hospitality
            come together in the heart of Marrakech.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reservation" className="btn-primary min-w-[220px] text-center">
              Book Your Stay
            </Link>
            <Link
              to="/gallery"
              className="border border-white/70 text-white px-6 py-3 uppercase tracking-widest text-sm font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 min-w-[220px] text-center"
            >
              View Gallery
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <img
                src="/images/the-entrance.png"
                alt="Hotel entrance"
                className="w-full h-[620px] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-2 md:-right-8 bg-gold-600 text-white px-8 py-6 shadow-xl">
                <p className="font-serif text-4xl mb-1">48</p>
                <p className="uppercase tracking-[0.2em] text-xs">Rooms & Suites</p>
              </div>
            </div>

            <div>
              <p className="text-gold-600 uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
                Welcome to Les Trois Palmiers
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
                A Boutique Address of Character, Comfort, and Quiet Luxury
              </h2>

              <p className="text-gray-600 leading-8 mb-6">
                Les Trois Palmiers offers a refined stay shaped by elegant architecture, warm service,
                and intimate spaces designed for relaxation. From the grand entrance to the calm lounge
                areas and beautifully appointed rooms, every detail is crafted to create a memorable
                experience.
              </p>

              <p className="text-gray-600 leading-8 mb-8">
                Whether you are traveling for leisure, romance, or a peaceful city escape, our hotel
                blends sophisticated comfort with authentic charm in a setting that feels both welcoming
                and exclusive.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about" className="btn-outline text-center">
                  Discover Our Story
                </Link>
                <Link to="/rooms" className="btn-primary text-center">
                  Explore Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#081225] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-400 uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
              Signature Experience
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              A Stay Designed Around Atmosphere
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto leading-8">
              Discover the spaces that make Les Trois Palmiers feel special: elegant interiors,
              peaceful pools, comfortable rooms, and a setting designed for both rest and beauty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-7 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-gold-600 uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
                Refined Interiors
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
                Beautiful Spaces for Quiet Moments and Memorable Stays
              </h2>
              <p className="text-gray-600 leading-8 mb-6">
                From the grand lobby and elegant hallways to our intimate seating areas and stylish
                lounge corners, the hotel has been designed to feel calm, sophisticated, and welcoming
                at every hour of the day.
              </p>
              <p className="text-gray-600 leading-8 mb-8">
                Every space reflects a balance of traditional character and modern comfort, making
                Les Trois Palmiers the ideal setting for guests who appreciate atmosphere as much as luxury.
              </p>
              <Link to="/gallery" className="btn-outline">
                See More Spaces
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/hallway2.png"
                alt="Hotel hallway"
                className="w-full h-64 md:h-72 object-cover shadow-lg"
              />
              <img
                src="/images/lounge2.png"
                alt="Hotel lounge"
                className="w-full h-64 md:h-72 object-cover mt-10 shadow-lg"
              />
              <img
                src="/images/lounge3.png"
                alt="Hotel seating area"
                className="w-full h-64 md:h-72 object-cover -mt-4 shadow-lg"
              />
              <img
                src="/images/pool2.png"
                alt="Pool by night"
                className="w-full h-64 md:h-72 object-cover mt-6 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-600 uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
              Accommodations
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">
              Selected Rooms & Suites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-8">
              A preview of our most requested accommodations, each offering its own atmosphere,
              layout, and style for an exceptional stay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roomPreview.map((room) => (
              <div key={room.name} className="group bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-gold-600 font-medium mb-4">From {room.price} / night</p>
                  <Link to="/rooms" className="btn-outline inline-block">
                    View Room Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/pool1.png"
            alt="Pool area"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs md:text-sm mb-4">
            Reserve Your Experience
          </p>

          <h2 className="font-serif text-4xl md:text-6xl mb-6">
            Let Your Stay Begin in Style
          </h2>

          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-8">
            Enjoy elegant rooms, relaxing pool spaces, warm hospitality, and a distinctive setting
            crafted for memorable stays in Marrakech.
          </p>

          <Link
            to="/reservation"
            className="inline-block bg-white text-gray-900 px-8 py-4 uppercase tracking-[0.25em] text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
          >
            Reserve Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;