import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Environment Variables Test:');
console.log('========================');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Test if Cloudinary config can be created
try {
  import('./src/config/cloudinary.js').then(({ default: cloudinary }) => {
    console.log('\nCloudinary Configuration:');
    console.log('========================');
    console.log('Cloud name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key ? 'Set' : 'Not set');
    console.log('API Secret:', cloudinary.config().api_secret ? 'Set' : 'Not set');
    
    // Test connection
    return cloudinary.api.ping();
  }).then(result => {
    console.log('\n✅ Cloudinary connection successful:', result);
  }).catch(error => {
    console.error('\n❌ Cloudinary error:', error.message);
  });
} catch (error) {
  console.error('Error importing cloudinary config:', error.message);
}
