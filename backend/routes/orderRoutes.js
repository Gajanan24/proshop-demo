const express = require('express')
const router = express.Router();
const {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    initiateRazorpayPayment,
    verifySignature
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect,getOrderById)
router.route('/:id/pay').put(updateOrderToPaid)
router.route('/:id/deliver').put(protect,admin,updateOrderToDelivered)
router.route('/payment').post(initiateRazorpayPayment)
router.route('/validate').post(verifySignature)

module.exports = router;