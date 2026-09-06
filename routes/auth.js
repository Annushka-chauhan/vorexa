import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
const router= express.Router();
router.post("/signup", async (req,res)=>{
  try{
    const {email, password} = req.body;
    //check if the user exist 
    const existingUser = await userModel.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "USer already exists with this email"})
    }
    const salt= await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(password, salt);
    const newUser = await userModel. create({
      email,
      password: hashedPassword,
    });
    //Create a jwt token which expires after 7 days 
    const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET,{
      expiresIn:"7d",
    });
    res.status(201).json({
      token, 
      user: {id: newUser._id, email: newUser.email},
    });
  }catch(err){
    res.status(500).json({error: err.message});
  }
});
router.post("/login", async (req,res)=>{
  try{
    const {email, password}= req.body;
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(400).json({message: "Invalid email or password"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch){
    res.status(400).json({message: "Invalid Id or password"});
   }
   const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET,{
    expiresIn:"7d",
   });
   res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;