const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    enum: ['Admin', 'Member', 'Guest'],
    default: 'Guest'
  }
});

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.virtual('url').get(function () {
  return `/profile/${this.username}`;
});

module.exports = mongoose.model('User', UserSchema);