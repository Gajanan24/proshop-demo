const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController')

const getProducts = productController.getProducts
const getProductById = productController.getProductById

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);


module.exports = router;