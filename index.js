import express from "express";
import 'dotenv/config'
import mongoose from "mongoose";
import cors from "cors";

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
    try {
        const employeeCollection = await mongoose.connection.db.collection('employees').find({}).toArray() //Find all document inside employees collection
        return res.json(employeeCollection);  // Return collections in JSON format
    } catch (error) {
        console.error('Error listing collections:', error);
        return res.status(500).json({ error: 'Error listing collections' });
    }
})

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