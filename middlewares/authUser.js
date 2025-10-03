import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = (req, res, next) => {
    try{
        const {token}= req.headers
        if(!token) {
            return res.json({ success: false, message: " No Authorised Login again" });
        }
        const token_decode= jwt.verify(token, process.env.JWT_SECRET);
         req.user = { userId: token_decode.id };
        next(); // Proceed to the next middleware or route handler
    }catch(error) {
        console.error("Error in authUser middleware:", error);
        return res.json({ success: false, message: "Internal server error" });
    }

}
export default authUser