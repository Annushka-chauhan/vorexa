import jwt from "jsonwebtoken";
export const protect = (req,res, next)=>{
  const authHeader= req.headers.authorization;
  /**authHeader =
"Bearer abc123xyz" */
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
    return res.json(401).json({message: "Access denied, No token provided"});
  }
  try{
    const decoded= jwt.verify(token, process.env.JWT_SECRET); 
    req.userId=decoded.userId;
    next();
  }catch(err){
    res.status(401).json({message: "Invalid or expired Token"});
  }
};
