const mongoose = require("mongoose");

const DashboardSchema = new mongoose.Schema({
  title: String,
  layout: Object,
});

module.exports = mongoose.model("Dashboard", DashboardSchema);
