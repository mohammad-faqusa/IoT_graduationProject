const path = require("path");

exports.getAddDevicePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/addDevice.html"));
};
