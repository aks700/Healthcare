import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = (req, res, next) => {
    try{
        let token= req.headers.authorization
        if(!token) {
            return res.status(401).json({ success: false, message: " Not Authorised or Invalid Credentials" });
        }
        token=token.split(" ")[1]
        const token_decode= jwt.verify(token, process.env.JWT_SECRET);
         req.user = { userId: token_decode.id };
        next(); // Proceed to the next middleware or route handler
    }catch(error) {
        console.error("Error in authUser middleware:", error);
        return res.json({ success: false, message: "Internal server error" });
    }

}
export default authUser