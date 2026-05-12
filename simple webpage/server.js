import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images, video)
app.use(express.static(__dirname));

// MongoDB (optional — app works even without it)
let dbConnected = false;
let Prediction;

try {
  await mongoose.connect("mongodb://127.0.0.1:27017/crop_yield");
  console.log("✅ MongoDB connected");
  dbConnected = true;
} catch (err) {
  console.warn("⚠️ MongoDB not available, running without DB persistence");
}

if (dbConnected) {
  Prediction = mongoose.model("Prediction", new mongoose.Schema({
    Crop_Type: String,
    Soil_Type: String,
    N: Number,
    P: Number,
    K: Number,
    Temperature: Number,
    Humidity: Number,
    Wind_Speed: Number,
    predicted_yield: Number
  }));
}

// Prediction API
app.post("/predict", async (req, res) => {
  console.log("🔥 /predict HIT");

  const { N, P, K, Temperature, Humidity, Wind_Speed } = req.body;

  const predicted_yield =
    (N * 0.3 + P * 0.2 + K * 0.25 +
     Temperature * 0.1 + Humidity * 0.1 -
     Wind_Speed * 0.05);

  if (dbConnected && Prediction) {
    try {
      await Prediction.create({ ...req.body, predicted_yield });
    } catch (e) {
      console.warn("DB save failed, skipping persistence");
    }
  }

  res.json({ success: true, predicted_yield });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});