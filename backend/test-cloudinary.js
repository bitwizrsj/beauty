import cloudinary from './src/config/cloudinary.js';

console.log('Testing Cloudinary configuration...');

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.log('\nMake sure your .env file has:');
    console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('CLOUDINARY_API_KEY=your_api_key');
    console.log('CLOUDINARY_API_SECRET=your_api_secret');
  });
