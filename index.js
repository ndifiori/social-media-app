const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan")

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post')

dotenv.config();

console.log("MONGODB_URI: " + process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017", 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error: ' + err);
  process.exit(1);
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
})

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

app.listen(3003, ()=> {
  console.log("server is running")
})