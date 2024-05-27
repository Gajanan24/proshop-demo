const express = require('express')
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview,getTopProducts } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware')
const checkObjectId = require('../middleware/checkObjectId');


router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id').get(checkObjectId, getProductById).put(checkObjectId, protect, admin, updateProduct).delete(checkObjectId, protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);




module.exports = router;