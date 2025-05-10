const DeviceModel = require("./../models/Device");

// Async function to fetch only the devices owned by a specific user
async function getDevices(userId) {
  try {
    const devices = await DeviceModel.find({ user: userId }).lean();
    console.log(devices[devices.length - 1]); // Optional: log the last device
    return devices;
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
}

// Export the function (not the variable)
module.exports = { getDevices };
