const mongoose = require('mongoose');
const { Store, Product } = require('./models');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const MONGO_URI = 'mongodb+srv://okonkwoperpetual06_db_user:7ShrMxbyxIUP16eK@cluster0.70gvapc.mongodb.net/bumpa-clone?retryWrites=true&w=majority';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Store.deleteMany({});
    await Product.deleteMany({});

    const sampleStore = await Store.create({
      name: "May's Bakery",
      slug: 'mays-bakery',
      description: 'Artisanal cakes, fresh pastries, and specialty breads baked daily with love.',
      email: 'maysbakery@gmail.com',
      phone: '07037586592'
    });

   await Product.create([
      {
        storeId: sampleStore._id,
        title: 'Chocolate Fudge Layer Cake',
        price: 18500,
        description: 'Rich, moist chocolate cake layered with dark chocolate ganache.',
        category: 'Cakes',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
      },
      {
        storeId: sampleStore._id,
        title: 'Red Velvet Birthday Cake',
        price: 22000,
        description: 'Classic red velvet layered with smooth cream cheese frosting.',
        category: 'Cakes',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500' // Updated URL
      },
      {
        storeId: sampleStore._id,
        title: 'Butter Croissants (Box of 4)',
        price: 6000,
        description: 'Flaky, golden, French-style butter croissants baked fresh every morning.',
        category: 'Pastries',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500'
      },
      {
        storeId: sampleStore._id,
        title: 'Assorted Fruit Tarts (Pack of 6)',
        price: 9500,
        description: 'Crisp pastry shells filled with vanilla custard and fresh seasonal fruit.',
        category: 'Pastries',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500'
      },
      {
        storeId: sampleStore._id,
        title: 'Artisanal Sourdough Bread',
        price: 3500,
        description: 'Naturally fermented crusty sourdough loaf with a soft, airy crumb.',
        category: 'Bread',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500' // Updated URL
      },
      {
        storeId: sampleStore._id,
        title: 'Gourmet Chocolate Chip Cookies',
        price: 4500,
        description: 'Chewy, butter cookies packed with Belgian dark chocolate chunks.',
        category: 'Snacks',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500'
      }
    ]);

    console.log('🎉 Bakery store & products seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();