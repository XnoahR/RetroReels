import express from "express";
import VhsRouter from "./routers/vhs.router.js"
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/vhs", VhsRouter);

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})