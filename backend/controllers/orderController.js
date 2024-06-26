const asyncHandler = require('../middleware/asyncHandler')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const Razorpay = require('razorpay');


const initiateRazorpayPayment = asyncHandler(async (req, res) => {
    const { orderId, amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Amount is required and should be a number' });
    }

    // Initialize Razorpay client
    const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });
    // Construct options for Razorpay payment
    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: orderId, // unique identifier for the order
        payment_capture: 1 // Automatically capture the payment after successful authorization
    };

    try {
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create(options);
        console.log("razorpay order.....",razorpayOrder);
        // Send Razorpay order ID and key to frontend
        res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            razorpayKey: process.env.KEY_ID,
        });
    } catch (error) {
        
        console.error('Error initiating Razorpay payment:', error);
        res.status(500).json({ error: 'Internal server error kalalal ka' });
    }
});



const verifySignature = asyncHandler(async (req, res) => {
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require("crypto");
    const key_secret = process.env.KEY_SECRET;
    const expectedSignature = crypto.createHmac('sha256', key_secret)
                                    .update(body)
                                    .digest('hex');

    console.log("Received Signature:", razorpay_signature);
    console.log("Generated Signature:", expectedSignature);

    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ signatureIsValid: true });
    } else {
        console.error("Error verifying signature:", {
            expected: expectedSignature,
            received: razorpay_signature,
        });
        res.status(400).json({
            signatureIsValid: false,
            error: 'Signature verification failed',
            expected: expectedSignature,
            received: razorpay_signature,
        });
    }
});

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
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
})


const updateOrderToPaid = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);

    console.log("recieved body: ",req.body);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

//admin's api 

const getOrderById = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if(order){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

const updateOrderToDelivered = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
})

const getOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
})

const updateStock = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    console.log("in update stock '😎😎😋😊");
    if (order) {
        const orderItems = order.orderItems;
    
        for (let item of orderItems) {
          const product = await Product.findById(item.product);
    
          if (product) {
            if (product.countInStock >= item.qty) {
              product.countInStock -= item.qty;
              await product.save();
            } else {
              return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }
          } else {
            return res.status(404).json({ message: `Product not found: ${item.product}` });
          }
        }
    
        res.status(200).json({ message: 'Stock updated successfully' });
      } else {
        res.status(404);
      }
    
})



module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    initiateRazorpayPayment,
    verifySignature,
    updateStock
}

