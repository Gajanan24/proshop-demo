const express = require('express')
const dotenv = require('dotenv')
dotenv.config();

const path = require('path')
const cookieParser = require('cookie-parser')

const cors = require('cors')
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

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
    origin: ["https://proshop-3u2y.onrender.com/","http://localhost:3000/"], // Change this to the origin(s) you want to allow.
    credentials: true, // Indicates that cookies and credentials should be included.
  };
   
app.use(cors(corsOptions));

//Cookie parser middleware
app.use(cookieParser());


// app.get('/', (req,res) => {
//     res.send("API is running")
// })

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in port ${port}`))

