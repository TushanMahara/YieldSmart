# 🌱 YieldSmart: Crop Yield & Fertilizer Recommendation System

YieldSmart is an intelligent agricultural assistant designed to help farmers and researchers predict crop yields and receive scientific fertilizer recommendations based on soil health and current weather conditions.

## 🚀 Features

- **Crop Yield Prediction**: Predicts potential yield based on crop type, soil type, and N-P-K (Nitrogen, Phosphorus, Potassium) values.
- **Weather Integration**: Automatically fetches real-time weather data for the specified location to improve prediction accuracy.
- **Fertilizer Recommendation**: Provides scientific N-P-K recommendations based on the target yield and soil conditions.
- **Multilingual Support**: Available in both English and Hindi to support local farming communities.
- **Interactive 3D UI**: Enhanced user experience using 3D elements for global agricultural mapping.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6), Three.js (for 3D graphics)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for storing prediction history and soil data)
- **APIs**: Real-time Weather API integration

## 📂 Project Structure

- `simple webpage/`: Main application for Crop Yield Prediction (Port 5000).
- `simple webpage reverse/`: Specialized module for Fertilizer Recommendations (Port 5001).

## 🚦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tushanmahara/Crop_Yeild.git
   cd Crop_Yeild
   ```

2. **Run the Crop Yield Predictor**:
   ```bash
   cd "simple webpage"
   npm install
   npm start
   ```
   Open [http://localhost:5000](http://localhost:5000)

3. **Run the Fertilizer Recommender**:
   ```bash
   cd "../simple webpage reverse"
   npm install
   npm start
   ```
   Open [http://localhost:5001](http://localhost:5001)

## 📄 License
This project is licensed under the ISC License.
