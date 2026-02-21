import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from "../lib/db.js"
import authRouter from "../routes/authRoutes.js";
import postRouter from "../routes/postRouter.js"

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: '10mb' })); // extend the default limit to handle large base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on PORT ${PORT}`)
    connectDB();
});

