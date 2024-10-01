import express from "express";
import 'dotenv/config'
import mongoose from "mongoose";
import cors from "cors";
import VideoTapeRouter from './src/router/VideoTapeRouter.js'



// ----- Initations -----
const app = express()

// ----- Middlewares -----
app.use(express.json())
app.use(cors())


// app.get('/', async (req, res) => {
//     try {
//         const employeeCollection = await mongoose.connection.db.collection('employees').find({}).toArray() //Find all document inside employees collection
//         return res.json(employeeCollection);  // Return collections in JSON format
//     } catch (error) {
//         console.error('Error listing collections:', error);
//         return res.status(500).json({ error: 'Error listing collections' });
//     }
// })

// ----- Routes -----
app.use('/videotape',VideoTapeRouter)

// ----- Connections -----
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Connected to the http://localhost:${port}`)
})

mongoose.connect(process.env.DATABASE, {
    autoIndex: true, // Ensure Mongoose automatically builds indexes
  }).then(() => {
    mongoose.connection.db.listCollections().toArray((err, names) =>{
        console.log(names)
    })
    console.log('Connected to mongoDB')
  });