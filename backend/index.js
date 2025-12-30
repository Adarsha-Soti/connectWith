import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import mongoose from 'mongoose';

const app=express();
const PORT=4000;

const userSchema =new mongoose.Schema({
    img: String,
    title:String,
    description:String,
    email:String,
},{ strict: false });
const User= mongoose.model("User",userSchema,"users");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    return res.json({
        status:"success",
        message:"spi gets ready!"
    })
});
app.get("/api/v1/users", async (req,res)=>{
   
    try{
        let users = await User.find();
    let formattedData= users.map((item)=>{
        return {
            img:item.img, title:item.title, description:item.description, email:item.email
        }
    });
    return res.json({
        dtatus:"success",
        message:"user fetched",
        data:formattedData
    })
    }
    catch(error){
        return res.status(500).json({ status: "error", message: error.message });
    }
    
});
app.post("/api/v1/users", async (req,res)=>{
    try{
        let newUserData=req.body;
        let saveUser= await User.create(newUserData);

        return res.status(201).json({
            status:"success",
            message:"user created successfully",
            data: saveUser
        });
    }
    catch(error){
        return res.status(500).json({ status:"error",message:"couldnot create user",error: error.message})
    }

})
const connectServer= async()=>{
   await mongoose
  .connect("mongodb://127.0.0.1:27017/myNewProject")
  .then(() => {
    console.log("Database Connected!");
    
    // Start listening ONLY after DB is connected
    app.listen(PORT, () => {
      console.log("SERVER STARTED AT PORT: ", PORT);
    }).on('error', (err) => {
      console.error("SERVER FAILED TO START:", err.message);
    });
  })
  .catch((err) => console.error("Database connection error:", err))
}
connectServer();



