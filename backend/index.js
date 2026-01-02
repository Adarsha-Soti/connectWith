import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import mongoose from 'mongoose';

const app=express();
const PORT = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;

//mongo db scheme for user _id directly comes form database
const userSchema =new mongoose.Schema({
    img: String,
    title:String,
    description:String,
    email:String
},{ strict: false });
const User= mongoose.model("User",userSchema,"users");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//check api is ready
app.get("/",(req,res)=>{
    return res.json({
        status:"success",
        message:"api gets ready!"
    })
});

//for cards to show values 
app.get("/api/v1/users", async (req,res)=>{
    try{
        let users = await User.find();
    let formattedData= users.map((item)=>{
        return {
            img:item.img, title:item.title, description:item.description, email:item.email,_id:item._id
        }
    });
    return res.status(201).json({
        dtatus:"success",
        message:"user fetched",
        data:formattedData
    })
    }
    catch(error){
        return res.status(500).json({ status: "error", message: error.message });
    }
    
});

//to handle data comming form createUser form frontend 
app.post("/api/v1/users", async (req,res)=>{
    try{
        let newUserData=req.body; //getting data from createuser form
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

});


app.patch("/api/v1/users/:_id",async(req,res)=>{
    try{
       let userId=req.params._id; //taking database id form editUser 
       let updatedData=req.body;
       let data=await User.findByIdAndUpdate(userId,updatedData,{new: true});//find user 

       if(!data){
            return res.status(404).json({
                status:"error",
                message:"user not found"
            })
       }

       return res.status(201).json({
        status:"success",
        message:"user updated",
        data:data
    })

    }
    catch(error){
    return res.status(500).json({
        status:"error",
        message:"couldnot perform edit",
        error:error.message
    })
    }
});

app.delete("/api/v1/users/:_id",async(req,res)=>{
    try{
       let userId=req.params._id;
       
       let deleteUser=await User.findByIdAndDelete(userId);

       if(!deleteUser){
            return res.status(404).json({
                status:"error",
                message:"user not found"
            })
       }else{
        return res.status(201).json({
                status:"success",
                message:"user was deleted"
            })
       }


    }
    catch(error){
    return res.status(500).json({
        status:"error",
        message:"couldnot perform delete",
        error:error.message
    })
    }
});

//database connection, mongo compass
const connectServer= async()=>{
   await mongoose
  .connect(dbUrl)
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
};


connectServer();



