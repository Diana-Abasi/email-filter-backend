const cron = require('node-cron');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const { sendEmail } = require('../utils/email');

// Schedule a task to run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily summary task...');

  try {
    const users = await QuarantinedEmail.aggregate([
      { $group: { _id: "$user", emails: { $push: "$$ROOT" } } },
    ]);

    for (const user of users) {
      const userId = user._id;
      const userEmails = user.emails;

      const userEmail = userEmails[0]?.userEmail; // Replace with a user lookup function
      const emailSummary = userEmails
        .map((email) => `Sender: ${email.sender}\nSubject: ${email.subject}`)
        .join('\n\n');

      const emailText = `Daily Quarantine Summary:\n\n${emailSummary}`;
      await sendEmail(userEmail, 'Daily Quarantine Summary', emailText);

      console.log(`Summary sent to ${userEmail}`);
    }
  } catch (err) {
    console.error('Error in daily summary task:', err.message);
  }
});

module.exports = {}; // Ensure compatibility when imported
