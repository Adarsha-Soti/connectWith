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
const connectServer= async()=>{
   await mongoose
    .connect("mongodb://127.0.0.1:27017/myNewProject")
    .then(() => console.log("Database Connected!"));

    app.listen(PORT, (error) => {
    if (error) {
        console.error("SERVER NOT STARTED");
    } else {
        console.log("SERVER STARTE AT PORT : ", PORT);
    }
    });
}
connectServer();



