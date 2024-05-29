const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail')

// @desc       Register user and get token
// @route      POST /api/users/login
// @access     Public
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error(' User already exists, Please login')
    }

    const user = await User.create({
        name,
        email,
        phoneNumber,
        password
    });

    if(user) {
        generateToken(res,user._id);

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            phoneNumber : user.phoneNumber,
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
            phoneNumber : user.phoneNumber,
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
            phoneNumber : user.phoneNumber,
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
       user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

       if(req.body.password){
        user.password = req.body.password;
       }

       const updateUser = await user.save();

       res.status(200).json({
        _id : updateUser._id,
        name : updateUser.name,
        phoneNumber : user.phoneNumber,
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
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc       Delete user 
// @route      DELETE /api/users/:id
// @access     Public
const deleteUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('Canot delete admin user');
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({ message: 'User deleted successfully'});
    } else {
        res.status(404);
        throw new Error('User Not Found')
    }
});

// @desc       Get user by ID
// @route      GET /api/users/:id
// @access     Private/admin
const getUserById = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User Not Found')
    }
});

// @desc       update user 
// @route      PUT /api/users/:id
// @access     private/admin
const updateUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phoneNumber : user.phoneNumber,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const requestPasswordReset = asyncHandler(async (req,res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("user email", email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        console.log(error);
        res.status(500).json({ message: 'Email could not be sent' });
    }


});
const resetPassword = async (req, res) => {
    const resetTokenHash = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token or token has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
};


module.exports = { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    requestPasswordReset,
    resetPassword
     }



