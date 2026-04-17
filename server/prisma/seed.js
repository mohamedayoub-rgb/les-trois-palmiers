const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const rooms = [
  {
    name: 'Royal Suite',
    slug: 'royal-suite',
    description: 'Experience unparalleled luxury in our Royal Suite, featuring a private terrace with panoramic ocean views, marble bathroom with jacuzzi, and exclusive butler service.',
    price: 850,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80'
  },
  {
    name: 'Deluxe Ocean View',
    slug: 'deluxe-ocean-view',
    description: 'Wake up to stunning Mediterranean views in our Deluxe Ocean View room, featuring contemporary elegance, private balcony, and premium amenities.',
    price: 450,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'
  },
  {
    name: 'Garden Villa',
    slug: 'garden-villa',
    description: 'Escape to tranquility in our Garden Villa, offering a private pool, lush tropical gardens, and spacious living area for the ultimate retreat.',
    price: 1200,
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80'
  },
  {
    name: 'Executive Suite',
    slug: 'executive-suite',
    description: 'Designed for the discerning business traveler, our Executive Suite features a dedicated workspace, high-speed internet, and luxurious comfort.',
    price: 550,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=80'
  },
  {
    name: 'Classic Room',
    slug: 'classic-room',
    description: 'Our Classic Room offers timeless elegance with modern amenities, featuring comfortable furnishings and a serene atmosphere.',
    price: 280,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80'
  },
  {
    name: 'Family Suite',
    slug: 'family-suite',
    description: 'Perfect for families, our Family Suite features interconnected rooms, a separate living area, and child-friendly amenities.',
    price: 650,
    capacity: 5,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80'
  }
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@lestroispalmiers.com' },
    update: {},
    create: {
      email: 'admin@lestroispalmiers.com',
      passwordHash: adminPassword
    }
  });
  console.log('Admin created:', admin.email);

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room
    });
  }
  console.log('Rooms seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
