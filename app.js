import 'dotenv/config'
const app = express()
const DBURI = process.env.MONGODB_URI
const PORT = process.env.PORT
import express from "express"; 
import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  
import cors from "cors"; 
import userModel from './Models/userSchema.js';
import userVerifyMiddle from './middleware/userVerify.js';
// import postModel from "./Models/postSchema.js";

// Middleware

const port = process.env.PORT || 3050;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//  mongodb configuration 
mongoose.connect(DBURI)
mongoose.connection.on("connected", ()=> console.log("MonoDB Connected"))

mongoose.connection.on("error",(err) => console.log("MongoDB Error", err))

// Signup route

app.post('/register' , async(req,res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        res.json({
            message: "Email already exists",
            status : false
        });
        return;
    }

    // Hash the Password

    const hashedPassword = await bcrypt.hash(password,10)
    console.log("hashpassword", hashedPassword)

    
    // Create the user in the db

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword})
        res.json({
            message: "User registered successfully",
            status : true
        });
    
})

// Login route

app.post('/login', async(req,res)=>{
    const {email, password} = req.body
    if(!email ||!password){
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }
      // Check if user exists
      const user = await userModel.findOne({email});
      if(!user){
        res.json({
          message: "User not found",
          status : false
        });
        return;
      }
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.json({
          message: "Invalid password",
          status : false
        });
        return;
      }
   
var token = jwt.sign({email: user.email, name: user.name,} , process.env.SECRET_KEY );

       // Login successful
       res.json({
        message: "Login successful",
        status : true,
        token: token
      });
    })

    app.get("/api/getusers", userVerifyMiddle, async(req,res)=>{
      try{
      const users = await userModel.find({});
      res.json({
        message: "all users get",
        status: true,
        users: users
      })
    }catch(error){
      console.log("Error", error)
      res.json({
        message: "Error fetching users",
        status: false
      })
    }
    })
     

app.listen(port, () => console.log('Server running'));