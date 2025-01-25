const express=require('express');

const app=express();

app.use("/hello",(req,res)=>{
    res.send("Hello from the user")
})

app.use("/",(req,res)=>{
    res.send("Hello from the user dashbod")
})

app.listen(3000,()=>{
    console.log("server is sucessfully litening in 3000")
});