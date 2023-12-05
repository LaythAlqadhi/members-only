const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

MessageSchema.virtual('url').get(function () {
  return `/messages/${this._id}`;
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model('Message', MessageSchema);