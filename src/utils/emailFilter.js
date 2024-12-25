const Whitelist = require('../models/Whitelist');
const QuarantinedEmail = require('../models/QuarantinedEmail');
const UserSettings = require('../models/UserSettings');

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

  // Default behavior
  const quarantinedEmail = new QuarantinedEmail({ user, sender, subject, body });
  await quarantinedEmail.save();
  return { status: 'quarantined', message: 'Email marked as spam and quarantined' };
};

module.exports = filterEmail;
