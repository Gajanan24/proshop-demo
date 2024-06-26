const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/userModel');

//protect routes
const protect = asyncHandler(async (req,res,next) => {
    let token;

    //read the jwt from cookie
    token = req.cookies.jwt;
    console.log("tokennnnnnnnnnnnnnnnnnnnnnnnn  "+ token);
    // console.log(req)
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized, Token  Failed...')

        }
       

    } else {
        res.status(401);
        throw new Error('Not Authorized, No Token .. OK? ...')
    }
})

// Admin middleware 
const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next();
    } else {
        res.status(401);
        throw new Error('Not Authorized as Admin')
    }
}; 

module.exports = { protect, admin }