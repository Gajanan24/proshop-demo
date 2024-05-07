const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true,
    },
    {
        name: 'John Bhai',
        email: 'john@gmail.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: false,
    },
    {
        name: 'John Due',
        email: 'jane@gmail.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: false,
    }
]
module.exports = users