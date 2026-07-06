const ActivityLog = require("../models/activityLog");

const logActivity = async ({ userId, userEmail, action, details }) => {
  return ActivityLog.create({ userId, userEmail, action, details });
};

const getAllLogs = async () => {
  return ActivityLog.find().sort({ timestamp: -1 });
};

module.exports = {
  logActivity,
  getAllLogs,
};
