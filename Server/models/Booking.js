const mongoose = require('mongoose');
const moment = require('moment'); // Use moment.js for easier date handling
const { Schema } = mongoose;

const BookingSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer', required: true },
    serviceName: { type: String, required: true },
    totalPrice: { type: Number },
    startDate: { type: String, required: true }, // Expected format: 'YYYY-MM-DD HH:mm' 2024-12-06
    startTime: { type: String, required: true }, // Expected format: 'HH:mm' 09:00
    endTime: { type: String, required: true },   // Expected format: 'HH:mm' 12:30
    duration: { type: Number, required: true },  // Duration in hours 1
    status: { 
        type: String, 
        enum: ['approval required', 'payment pending', 'booked', 'rejected'], 
        default: 'approval required' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


//Assumes startTime and endTime include both the date and time (i.e., YYYY-MM-DD HH:mm)

// BookingSchema.pre('save', function (next) {
    
//     if (this.startTime && this.endTime) {
//         const start = moment(this.startTime, 'YYYY-MM-DD HH:mm');
//         const end = moment(this.endTime, 'YYYY-MM-DD HH:mm');
//         const durationInHours = end.diff(start, 'hours', true); // Calculate hours including fractions
//         this.duration = durationInHours; // Store computed duration
//     }
//     this.updatedAt = Date.now();
//     next();
// });


//Assumes startTime and endTime are in HH:mm format (not including the date).

BookingSchema.pre('save', function (next) {
   
    if (this.startDate && this.startTime && this.endTime) {
        const start = moment(`${this.startDate} ${this.startTime}`, 'YYYY-MM-DD HH:mm');
        const end = moment(`${this.startDate} ${this.endTime}`, 'YYYY-MM-DD HH:mm');
        
        const durationInHours = end.diff(start, 'hours', true); // Calculate hours, including fractions
        this.duration = durationInHours; // Store the computed duration
    }
    
    this.updatedAt = Date.now();
    next();
});


// BookingSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });


const BookingModel = mongoose.model('Bookings', BookingSchema);

module.exports = BookingModel;
