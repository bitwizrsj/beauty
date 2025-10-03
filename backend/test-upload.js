import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

dotenv.config();

// Create a simple test image (1x1 pixel PNG)
const createTestImage = () => {
  // Base64 encoded 1x1 pixel PNG
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64Image, 'base64');
  fs.writeFileSync('test-image.png', buffer);
  return 'test-image.png';
};

const testUpload = async () => {
  try {
    // First, login to get a token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ecommerce.com',
        password: 'Admin@123456'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;

    console.log('✅ Login successful');

    // Create test image
    const testImagePath = createTestImage();
    console.log('📷 Created test image');

    // Test upload
    console.log('📤 Testing image upload...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));

    const uploadResponse = await fetch('http://localhost:5000/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}\n${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload successful!');
    console.log('📸 Image URL:', uploadData.url);

    // Clean up
    fs.unlinkSync(testImagePath);
    console.log('🧹 Cleaned up test image');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Check if server is running first
fetch('http://localhost:5000')
  .then(() => {
    console.log('🌐 Server is running, starting upload test...');
    testUpload();
  })
  .catch(() => {
    console.error('❌ Server is not running on port 5000');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  });
