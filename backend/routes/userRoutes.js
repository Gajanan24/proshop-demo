const express = require('express')
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/logout', logoutUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)
router.post('/request-reset-password',requestPasswordReset);
router.post('/reset-password/:resetToken',resetPassword);    

module.exports = router;