const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const connectDB = require('./meme_server/config/db')
const memeRoutes = require('./meme_server/routes/memeRoutes')
const cors = require('cors');
//app.use(cors());

const authRoutes = require('./meme_server/routes/authRoutes')
dotenv.config()
const app = express()
app.use(cors({
    origin: 'http://localhost:3001',  // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
connectDB();
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api',memeRoutes)
app.get('/',(req,res)=>res.send('Welcome to the Meme API!'))

const PORT = process.env.PORT || 7000
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
