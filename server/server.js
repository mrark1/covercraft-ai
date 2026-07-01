const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://covercraft-ai-delta.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

const coverLetterRoutes = require("./routes/coverLetter");

app.use("/api/generate", coverLetterRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CoverCraft AI Backend Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});
