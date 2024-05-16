const express = require('express')
const dotenv = require('dotenv')
dotenv.config();

const cookieParser = require('cookie-parser')

const cors = require('cors')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

const errorMiddleware = require('./middleware/errorMiddleware');

const notFound = errorMiddleware.notFound;
const errorHandler = errorMiddleware.errorHandler;



const connectDB = require('./config/db')

const port = process.env.PORT || 5000;
connectDB();

const app= express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000", // Change this to the origin(s) you want to allow.
    credentials: true, // Indicates that cookies and credentials should be included.
  };
   
app.use(cors(corsOptions));

// const corsOptions = {
//     origin: "http://localhost:3000",
//     credentials: true
// };
// app.use( cors(corsOptions) );


//Cookie parser middleware
app.use(cookieParser());


app.get('/', (req,res) => {
    res.send("API is running")
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in port ${port}`))

