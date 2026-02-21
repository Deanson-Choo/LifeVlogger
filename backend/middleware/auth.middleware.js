import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer token
        if (!token) return res.status(401).json( { message: "Authorization Denied, Token Missing" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json( { message: "Authorization Denied, User Not Found" })

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json( { message: "Authorization Denied, Invalid Token" })
    }
}

export default protectRoute;