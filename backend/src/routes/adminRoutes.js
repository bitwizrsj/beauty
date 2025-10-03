import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);

// Image upload route with better error handling
router.post('/upload', (req, res) => {
  // Set timeout to prevent hanging
  req.setTimeout(30000); // 30 seconds
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      });
    }

    try {
      console.log('Upload request received:', {
        file: req.file ? 'File present' : 'No file',
        body: req.body,
        headers: req.headers['content-type']
      });

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image uploaded'
        });
      }

      console.log('File uploaded successfully:', {
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      });

      res.json({
        success: true,
        url: req.file.path
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Image upload failed: ' + error.message
      });
    }
  });
});

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/images', upload.array('images', 5), uploadProductImages);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
