import express from 'express';
import morgan from 'morgan'
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloundinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';



// app configuration
const app = express();
const PORT = process.env.PORT || 4000;
// connect to database
connectDB()
// connect to cloudinary
await connectCloudinary();

// middleware
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
    ],
    credentials: true
}));

// api endpoints
// localhost:4000/api/admin/add-doctor
app.use("/api/admin", adminRouter)

app.use("/api/doctor", doctorRouter)

app.use("/api/user", userRouter)


app.get("/", (req, res) => {
    res.send("Api working successfully");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});