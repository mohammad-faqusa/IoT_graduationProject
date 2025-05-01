const path = require("path");

exports.displayDashboard = (req, res) => {
  res.sendFile(path.resolve("public/refinedDashboard.html"));
};
