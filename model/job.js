import mongoose from "mongoose";
const jobSchema =new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company:{
      type: String,
      required: [true, "Company name is required Filed"],
      trim : true,
    },
    role:{
      type: String, 
      required: [true, "Job role is a required Field"],
      trim: true,
    },
    status:{
      type: String, 
      enum: ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"],
      default: "APPLIED",
    },
    salary: {
      type: String, 
      default: "",
    },
    notes: {
      type: String, 
      default: "",
    },
  },
  {timestamp : true}
);
export default mongoose.model("Job", jobSchema)