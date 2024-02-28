const mongoose = require('mongoose');
const {Schema} = mongoose;

const PhotographerSchema = new Schema({
  name: String,
  email: {type:String, unique:true},
  password: String,
  contact: String,
  address: String,
  portfolio: String,
  isVerified: {type:Boolean, default:false},


});

const PhotographerModel = mongoose.model('Photographer', PhotographerSchema);

module.exports = PhotographerModel;