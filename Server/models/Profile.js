const mongoose = require('mongoose');
const {Schema} = mongoose;

const profileSchema = new Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'Photographer'},
  title: String,
  // state: String,
  city: String,
  description: String,
  photos: [String],
  languages: [String],
  //services: [String],  
  services: [
    {
      name: String,
      pricePerDay: Number,
    },
  ],
});

const ProfileModel = mongoose.model('Profile',profileSchema);
module.exports = ProfileModel;