import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from "../lib/db.js"
import authRouter from "../routes/authRoutes.js";
import postRouter from "../routes/postRouter.js"

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
    connectDB();
});

