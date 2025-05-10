const path = require("path");

exports.displayDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/refinedDashboard.html"));
};
