import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDatabase from '../config/database.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const importData = async () => {
  try {
    await connectDatabase();

    const data = JSON.parse(
      fs.readFileSync(join(__dirname, '../../data/sample-data.json'), 'utf-8')
    );

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Existing data deleted...');

    const createdUsers = await User.create(data.users);
    console.log(`${createdUsers.length} users created`);

    const createdCategories = await Category.create(data.categories);
    console.log(`${createdCategories.length} categories created`);

    // Map products to appropriate categories based on tags
    const productsWithCategory = data.products.map(product => {
      // Find the best matching category based on product tags
      let categoryId = createdCategories[0]._id; // default fallback
      
      if (product.tags && product.tags.length > 0) {
        // Try to find a matching category by name
        const matchingCategory = createdCategories.find(cat => {
          const categoryName = cat.name.toLowerCase();
          return product.tags.some(tag => 
            tag.toLowerCase().includes(categoryName) || 
            categoryName.includes(tag.toLowerCase())
          );
        });
        
        if (matchingCategory) {
          categoryId = matchingCategory._id;
        } else {
          // Fallback to main categories based on primary tag
          const primaryTag = product.tags[0].toLowerCase();
          if (primaryTag.includes('skincare') || primaryTag.includes('serum') || primaryTag.includes('cleanser') || primaryTag.includes('moisturizer') || primaryTag.includes('cream')) {
            const skincareCat = createdCategories.find(c => c.name === 'Skincare');
            if (skincareCat) categoryId = skincareCat._id;
          } else if (primaryTag.includes('makeup') || primaryTag.includes('lipstick') || primaryTag.includes('foundation') || primaryTag.includes('mascara') || primaryTag.includes('eyeshadow')) {
            const makeupCat = createdCategories.find(c => c.name === 'Makeup');
            if (makeupCat) categoryId = makeupCat._id;
          } else if (primaryTag.includes('hair') || primaryTag.includes('shampoo') || primaryTag.includes('conditioner') || primaryTag.includes('oil')) {
            const hairCat = createdCategories.find(c => c.name === 'Hair Care');
            if (hairCat) categoryId = hairCat._id;
          } else if (primaryTag.includes('fragrance') || primaryTag.includes('perfume') || primaryTag.includes('cologne')) {
            const fragranceCat = createdCategories.find(c => c.name === 'Fragrance');
            if (fragranceCat) categoryId = fragranceCat._id;
          } else if (primaryTag.includes('body') || primaryTag.includes('lotion') || primaryTag.includes('wash')) {
            const bodyCat = createdCategories.find(c => c.name === 'Bath & Body');
            if (bodyCat) categoryId = bodyCat._id;
          } else if (primaryTag.includes('tools') || primaryTag.includes('brush') || primaryTag.includes('roller')) {
            const toolsCat = createdCategories.find(c => c.name === 'Tools & Brushes');
            if (toolsCat) categoryId = toolsCat._id;
          } else if (primaryTag.includes('gift')) {
            const giftCat = createdCategories.find(c => c.name === 'Gifts & Value Sets');
            if (giftCat) categoryId = giftCat._id;
          }
        }
      }
      
      return {
        ...product,
        category: categoryId
      };
    });

    const createdProducts = await Product.create(productsWithCategory);
    console.log(`${createdProducts.length} products created`);

    console.log('Data imported successfully!');
    console.log('\n=== SAMPLE CREDENTIALS ===');
    console.log('Admin:');
    console.log('  Email: admin@ecommerce.com');
    console.log('  Password: Admin@123456');
    console.log('\nUser:');
    console.log('  Email: john@example.com');
    console.log('  Password: User@123456');
    console.log('==========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDatabase();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
