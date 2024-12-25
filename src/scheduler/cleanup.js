const cron = require('node-cron');
const QuarantinedEmail = require('../models/QuarantinedEmail');

// Schedule a task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const result = await QuarantinedEmail.deleteMany({ date: { $lt: thirtyDaysAgo } });
    console.log(`Deleted ${result.deletedCount} old quarantined emails`);
  } catch (err) {
    console.error('Error cleaning up quarantined emails:', err.message);
  }
});

module.exports = {}; // Ensure compatibility when imported
