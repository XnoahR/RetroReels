import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import VideoTapeRouter from "./src/router/VideoTapeRouter.js";
import AuthRouter from "./src/router/AuthRouter.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler, notFound } from "./src/middlewares/ErrorHandler.js";
// ----- Initations -----
const app = express();

// ----- Middlewares -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
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
app.use("/api/videotape", VideoTapeRouter);
app.use("/api/user", AuthRouter);
app.get('/api/test', (req,res) => {
  res.status(200).json({
    message: "Connected tp endpoint"
  })
})

// ----- Middlewares -----
app.use(notFound)
app.use(errorHandler)


// ----- Connections -----
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connected to the http://localhost:${port}`);
});

mongoose
  .connect(process.env.DATABASE, {
    autoIndex: true, // Ensure Mongoose automatically builds indexes
  })
  .then(() => {
    mongoose.connection.db.listCollections().toArray((err, names) => {
      console.log(names);
    });
    console.log("Connected to mongoDB");
  });
