import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
  email:{
    type: String, 
    required: [true, "Email is Required"],
    unique: true, 
    lowercase: true, 
    trim: true,
  },
  password:{
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be atleast of 6 characters"]
  },
},
//Automatically keep track of the date and time this record was created and whenever it gets changed
//When you turn this option on, Mongoose automatically adds two fields to your database entries for you:

//createdAt: The exact date and time the item was first added to the database. (It never changes after creation).

//updatedAt: The exact date and time the item was last modified. (It updates automatically every time you edit any detail, like changing a job's status from "Applied" to "Interviewing").
{timestamp: true}
);

export default mongoose.model("userModel", userSchema);