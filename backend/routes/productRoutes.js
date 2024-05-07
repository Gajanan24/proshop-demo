const express = require('express')
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel')
const productController = require('../controllers/productController')

const getProducts = productController.getProducts
const getProductById = productController.getProductById

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);


module.exports = router;