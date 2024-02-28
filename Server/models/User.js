const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  fname: String,
  lname: String,
  contact: String, // Use String for contact number
  email: { type: String, unique: true },
  password: String,
  address: String,
 
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
