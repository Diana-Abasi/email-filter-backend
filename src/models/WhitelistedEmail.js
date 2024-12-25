const mongoose = require('mongoose');

const whitelistedEmailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WhitelistedEmail', whitelistedEmailSchema);
