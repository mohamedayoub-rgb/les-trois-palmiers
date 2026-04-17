import { Link } from 'react-router-dom';

function About() {
  const stats = [
    { value: '25+', label: 'Years of Excellence' },
    { value: '48', label: 'Luxury Rooms & Suites' },
    { value: '3', label: 'Michelin Stars' },
    { value: '100+', label: 'Dedicated Staff' }
  ];

  return (
    <div className="pt-24">
      <section className="relative h-[60vh]">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          alt="Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <p className="text-gold-400 uppercase tracking-widest text-sm mb-4">Our Story</p>
            <h1 className="font-serif text-5xl md:text-6xl">A Legacy of Luxury</h1>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-600 uppercase tracking-widest text-sm mb-4">Since 1998</p>
              <h2 className="font-serif text-4xl mb-6">Crafting Unforgettable Experiences</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Les Trois Palmiers was founded with a singular vision: to create a haven 
                of sophistication where every detail reflects the pinnacle of French hospitality. 
                For over two decades, we have welcomed discerning travelers from around the world, 
                offering them an escape from the ordinary.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our commitment to excellence has earned us numerous accolades, including 
                three Michelin stars for our signature restaurant. Each room, each dish, each moment 
                is crafted with meticulous attention to detail.
              </p>
              <Link to="/contact" className="btn-outline">
                Plan Your Visit
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80"
                alt="Interior"
                className="w-full h-64 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"
                alt="Villa"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-5xl text-gold-600 mb-2">{stat.value}</p>
                <p className="text-gray-600 uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-4">Our Team</p>
            <h2 className="font-serif text-4xl">The People Behind the Magic</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Jean-Pierre Dubois', role: 'General Manager', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
              { name: 'Marie Laurent', role: 'Executive Chef', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
              { name: 'Alexandre Blanc', role: 'Guest Services Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 mx-auto rounded-full object-cover mb-6"
                />
                <h3 className="font-serif text-xl text-gray-900">{member.name}</h3>
                <p className="text-gold-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;