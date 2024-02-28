const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer' },
    serviceName: String,
    totalPrice: Number,
    startDate: String,
    endDate: String,
});

const BookingModel = mongoose.model('Bookings', BookingSchema);

module.exports = BookingModel;