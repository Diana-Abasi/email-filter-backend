const Whitelist = require('../models/Whitelist');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const UserSettings = require('../models/UserSettings');
const sendNotification = require('./emailNotifier'); // Import the notifier

const filterEmail = async (user, sender, subject, body) => {
  const whitelist = await Whitelist.find({ user });
  const settings = await UserSettings.findOne({ user });

  // Check whitelist
  const isWhitelisted = whitelist.some((entry) => entry.email === sender);

  // Check custom always trust rules
  const isCustomTrusted = settings?.customAlwaysTrust.some((rule) => sender.includes(rule));

  if (isWhitelisted || isCustomTrusted) {
    return { status: 'allowed', message: 'Email is trusted or whitelisted' };
  }

  // Default: Quarantine email
  const quarantinedEmail = new QuarantinedEmail({ user, sender, subject, body });
  await quarantinedEmail.save();

  // Send notification if enabled
  if (settings?.emailNotifications) {
    const notificationMessage = `
      A new email has been quarantined:
      - Sender: ${sender}
      - Subject: ${subject}
    `;
    await sendNotification(settings.user.email, 'Email Quarantined', notificationMessage);
  }

  return { status: 'quarantined', message: 'Email marked as spam and quarantined' };
};

module.exports = filterEmail;
