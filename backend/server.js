const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();
const app = express();

// Utilisez le middleware CORS
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("opaa");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Serveur en marche sur le port ${PORT}`.blue.bold)
);
