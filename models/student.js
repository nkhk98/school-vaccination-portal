const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    vaccinationStatus: [{
        vaccineName: { type: String, required: true },
        date: { type: Date, required: true },
        driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'VaccinationDrive' } // Connect to drive
    }],
    dateOfBirth: { type: Date } // Added for potential use in filtering/reports
});

module.exports = mongoose.model('Student', studentSchema);