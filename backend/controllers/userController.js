const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const jwt = require('jsonwebtoken')

// @desc       Register user and get token
// @route      POST /api/users/login
// @access     Public
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error(' User already exists, Please login')
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user) {
        generateToken(res,user._id);

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error(' Invalid User Data !!! ');
    }

    
});

// @desc       LogOut user/ clear cookie
// @route      POST /api/users/login
// @access     private
const logoutUser = asyncHandler(async (req,res) => {

    console.log('😁😀😁 logged outtttttt')
    res.cookie('jwt' , '', {
        httpOnly : true,
        expires : new Date(0)
    });
    res.status(200).json( { message : ' Logged out successfully 🙋‍♂️'});
});

// @desc       Get user profile
// @route      GET /api/users/login
// @access     private
const getUserProfile = asyncHandler(async (req,res) => {
    
    const user = await User.findById(req.user._id);

    if(user) {
        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User Not Found')
    }
});

// @desc       Auth user and get token
// @route      POST /api/users/login
// @access     Public
const  authUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(user && (await user.matchPassword(password)))
    {   
        generateToken(res, user._id);

        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
        });

    } else {
        res.status(401);
        throw new Error('Invalid email or password')
    }
});

// @desc       Update user profile
// @route      PUT /api/users/profile
// @access     Private
const updateUserProfile = asyncHandler(async (req,res) => {

     const user = await User.findById(req.user._id);

    if(user) {
       user.name = req.body.name || user.name;
       user.email = req.body.email || user.email;

       if(req.body.password){
        user.password = req.body.password;
       }

       const updateUser = await user.save();

       res.status(200).json({
        _id : updateUser._id,
        name : updateUser.name,
        email : updateUser.email,
        isAdmin : updateUser.isAdmin,
    });


    } else {
        res.status(404);
        throw new Error('User Not Found')
    }
    
});

// @desc       Get users
// @route      GET /api/users
// @access     Public
const getUsers = asyncHandler(async (req,res) => {
    res.send("get users");
});

// @desc       Delete user 
// @route      DELETE /api/users/:id
// @access     Public
const deleteUser = asyncHandler(async (req,res) => {
    res.send("delete user");
});

// @desc       Get user by ID
// @route      GET /api/users/:id
// @access     Private/admin
const getUserById = asyncHandler(async (req,res) => {
    res.send("get user by id");
});

// @desc       update user 
// @route      PUT /api/users/:id
// @access     private/admin
const updateUser = asyncHandler(async (req,res) => {
    res.send("update user");
});


module.exports = { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
     }



