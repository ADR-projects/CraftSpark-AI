const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const generateRoutes = require("./routes/generate.js");
const craftsRoutes = require("./routes/crafts.js");
const authRoutes = require("./routes/auth.js");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/craftspark")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {
  res.send('Server root working!');
});

app.use("/generate", generateRoutes);
app.use("/crafts", craftsRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// Trigger restart for .env load
