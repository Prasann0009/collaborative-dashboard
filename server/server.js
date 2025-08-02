const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require("socket.io");
require("dotenv").config();

const dashboardRoutes = require("./routes/dashboards");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use("/dashboards", dashboardRoutes);

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-dashboard", (dashboardId) => {
    socket.join(dashboardId);
  });

  socket.on("update-layout", ({ dashboardId, layout }) => {
    socket.to(dashboardId).emit("layout-updated", layout);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
