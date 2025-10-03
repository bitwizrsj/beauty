# Cloudinary Image Upload Setup

## Quick Setup Steps

### 1. Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials
1. Go to your Cloudinary Dashboard
2. Copy these three values:
   - **Cloud Name** (e.g., `d1234567890`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Set Environment Variables
Create a `.env` file in the `beauty/backend` folder:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Other required variables
MONGODB_URI=mongodb://localhost:27017/beauty-store
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
```

### 4. Test Your Setup
Run the test script to verify Cloudinary is working:

```bash
cd beauty/backend
node test-cloudinary.js
```

You should see:
```
✅ Cloudinary connection successful: { status: 'ok' }
```

### 5. Start the Server
```bash
npm run dev
```

## Troubleshooting

### Error: "Cloudinary connection failed"
- **Check credentials**: Make sure all three values are correct
- **No spaces**: Remove any spaces around the values
- **Quotes**: Don't use quotes around the values in .env
- **File location**: Make sure .env is in `beauty/backend/` folder

### Error: "Image upload failed" (404)
- Make sure the server is running on port 5000
- Check that the upload endpoint is accessible: `POST http://localhost:5000/api/admin/upload`
- Verify you're logged in as admin

### Error: "No image uploaded"
- Check file size (max 10MB for free tier)
- Check file format (jpg, jpeg, png, webp allowed)
- Make sure you're selecting files in the admin panel

### Error: "Unauthorized"
- Make sure you're logged in as an admin user
- Check that your JWT token is valid
- Try logging out and logging back in

## Testing the Upload

### 1. Login as Admin
- Email: `admin@ecommerce.com`
- Password: `Admin@123456`

### 2. Go to Admin Panel
- Navigate to `/admin/products`
- Click "Add Product"

### 3. Upload Images
- Click "Upload Images" area
- Select one or more image files
- Images should appear with previews
- Click "Create Product" to save

## Image Storage Details

- **Folder**: Images are stored in `ecommerce/` folder on Cloudinary
- **Transformations**: Images are automatically resized to max 1000x1000px
- **Formats**: jpg, jpeg, png, webp
- **Max Size**: 10MB per image (free tier limit)

## API Endpoints

### Upload Image
```
POST /api/admin/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Form data:
- image: <file>
```

### Response
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/ecommerce/filename.jpg"
}
```

## Production Notes

- For production, consider upgrading your Cloudinary plan
- Set up proper CORS policies
- Add image optimization settings
- Consider adding image compression
- Set up backup strategies for important images

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Upload size**: 10MB per image

These limits are usually sufficient for development and small applications.
