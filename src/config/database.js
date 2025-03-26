

const mongoose = require('mongoose')

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://gagansalian04102005:mLNFkpZ736rn5u5Q@skydb.llxuf.mongodb.net/devTinder")
}


module.exports=connectDB;