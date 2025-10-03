import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = (req, res, next) => {
    try{
        let atoken= req.headers.authorization     
        
        // console.log(atoken)
        if(!atoken) {
            return res.status(401).json({ success: false, message: "Not Authorised or Invalid Credentials" });
        }
        atoken=atoken.split(' ')[1]
        const token_decode= jwt.verify(atoken, process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Forbidden: Invalid token" });
        }

        next(); // Proceed to the next middleware or route handler
    }catch(error) {
        console.error("Error in authAdmin middleware:", error);
        return res.json({ success: false, message: "Internal server error" });
    }

}
export default authAdmin;