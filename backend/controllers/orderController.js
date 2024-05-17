const asyncHandler = require('../middleware/asyncHandler')
const Order = require('../models/orderModel')
const RazorPay = require('razorpay')
const crypto = require('crypto')


const addOrderItems = asyncHandler(async (req,res) => {
   
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    if( orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems : orderItems.map((x) => ({
                ...x,
                product : x._id,
                _id : undefined
            })),
            user : req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
    
});

const getMyOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({ user : req.user._id });
    res.status(200).json(orders);
})


const updateOrderToPaid = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.payer.email_address,
        };

        const updatedOrder = await Order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

//admin's api 

const getOrderById = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    console.log(order);
    if(order){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

const updateOrderToDelivered = asyncHandler(async (req,res) => {
    res.send('update order to delivered');
})

const getOrders = asyncHandler(async (req,res) => {
    res.send('get all orders');
})

const verifyPayment = asyncHandler(async (req,res) => {
    const {
        orderId,
        paymentId,
        razorpay_signature
    } = req.body;
    let sign = orderId + "|" + paymentId;
    var expectedSignature =  crypto.createHmac('sha256', process.env.KEY_SECRET)
        .update(sign.toString())
        .digest('hex');
    
        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({message : 'Payment Verified Successfully'});
        } else {
            res.status(400);
            throw new Error('Invalid Signature');
        }
            
})

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    verifyPayment
}

