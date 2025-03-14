

const mongoose = require('mongoose')

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://gagansalian04102005:cX200hJt3u30BV8U@skydb.llxuf.mongodb.net/devTinder")
}


module.exports=connectDB;