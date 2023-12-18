const express = require("express")
const router = require("./routes/userRoutes")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use("/api", router)

mongoose.connect("mongodb+srv://ashish_mernAuth:mernAuth3@cluster0.lwdqpyi.mongodb.net/").then(()=>{
    app.listen(4000, ()=>{console.log("server started at http://localhost:4000")})
    console.log("Database Connected successfully")
}).catch((error)=>{
    console.log("Error whilel conntecting with database :", error.message)
})



