import express from "express";
import Job from "../model/job.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.get("/", async (req,res)=>{
  try {
    const jobs = await Job.find({userId: req.userId}).sort({createdAt: -1});
    res.json(jobs);
  }catch(err){
    res.status(500).json({error: err.message});
  }
});
router.post("/",async(req,res)=>{
  try{
  const {company, role, status,salary, notes }= req.body;
  const newJob = await Job.create({
    userId: req.userId,
    company, 
    role,
    status,
    salary,
    notes
  });
  res.status(201).json(newJob);
}catch(err){
  res.status(400).json({error: err.message});
}
});
router.patch("/:id", async(req,res)=>{
  try{
  const {id}= req.params;
  const updatedJob = await Job.findOneAndUpdate(
    { _id: id, userId: req.userId },
      req.body,
    { new: true, runValidators: true }
  );
  if(!updatedJob){
    return res.status(404).json({message: "Job application Not found"});
  }
  res.json(updatedJob);
}catch(err){
    res.status(400).json({error: err.message});
}
});

router.delete("/:id", async (req,res)=>{
  try{
    const { id } = req.params;
    const deleteJob = await Job.findOneAndDelete({_id: id, userId: req.userId});
    if (!deleteJob) {
      return res.status(404).json({ message: "Job application not found." });
    }
    res.json({ message: "Job application removed successfully." });
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;