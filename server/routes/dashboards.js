const express = require("express");
const router = express.Router();
const Dashboard = require("../models/Dashboard");

router.get("/", async (req, res) => {
  const dashboards = await Dashboard.find();
  res.json(dashboards);
});

router.post("/", async (req, res) => {
  const newDash = await Dashboard.create(req.body);
  res.json(newDash);
});

module.exports = router;
