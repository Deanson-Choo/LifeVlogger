import express from 'express';
import User from '../models/User.js';
import jwt from "jsonwebtoken";

const authRouter = express.Router();


authRouter.post("/register", async (req,res) => {
    const { email, password, username } = req.body;

    // Error Check
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Please fill in all fields" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    const existingEmail = await User.findOne( { email } );
    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" })
    }

    const existingUsername = await User.findOne( { username } );
    if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" })
    }
    
    // Send To MongoDB
    try {
        const newUser = new User({
            email,
            password,
            username
        })

        await newUser.save()

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            token,
            user: {
                email,
                username
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Error Check
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" })
    }

    const user = await User.findOne( { email })
    if (!user) return res.status(400).json( { message: "User does not exist" } )

    try {
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) return res.status(400).json( { message: "Incorrect Password!" } );

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json( {
            token,
            user: {
                username: user.username,
                email
            }
        })

    } catch(error) {
        console.log(error)
        res.status(500).json( { message: "Server Error"} )
    }
})

export default authRouter;