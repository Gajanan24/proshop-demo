const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const productRoutes = require('./routes/productRoutes')
const errorMiddleware = require('./middleware/errorMiddleware');

const notFound = errorMiddleware.notFound;
const errorHandler = errorMiddleware.errorHandler;


dotenv.config();

const connectDB = require('./config/db')

const port = process.env.PORT || 5000;
connectDB();

const app= express();

app.use(cors());

app.get('/', (req,res) => {
    res.send("API is running")
})

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in port ${port}`))

