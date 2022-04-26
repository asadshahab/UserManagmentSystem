const mongoose=require('mongoose')

try {
    mongoose.connect("mongodb://127.0.0.1:27017/user_mangment_sysytem")
    console.log("DB syc successfully")
} catch (error) {
    console.log(error);
}

const express=require('express')
const app=express();

// For User Routes
const userRoute= require('./routes/userRoute')
app.use('/',userRoute)

// For Admin Routes
const adminRoute= require('./routes/adminRoute')
app.use('/admin',adminRoute)
 const PORT=3000
app.listen(PORT, function(){
    console.log(`Server is runing on PORT:${PORT}`)
})