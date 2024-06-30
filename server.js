import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import workoutRouter from "./routes/workoutRoute.js"
import { connectDb } from "./db/config.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// cors origin
app.use(cors({
  origin: ["https://loksun-ai-front-end.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "16kb" })); // json body
app.use(express.urlencoded({ extended: true })); // to decode the url special character

// routes
app.get("/", (req, res) => {
  res.status(200).json("Home Route");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/workout",workoutRouter);


connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("server Started", port);
    });
  })
  .catch((err) => {
    console.log("Server unable to connect with Db");
  });
