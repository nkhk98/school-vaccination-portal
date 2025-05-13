const mongoose = require('mongoose');

const vaccinationDriveSchema = new mongoose.Schema({
    vaccineName: { type: String, required: true },
    date: { type: Date, required: true },
    availableDoses: { type: Number, required: true, min: 0 },
    applicableClasses: { type: [String], required: true },
    studentsVaccinated: [{  // Keep track of which students got vaccinated in this drive
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        date: { type: Date, required: true }
    }]
});

module.exports = mongoose.model('VaccinationDrive', vaccinationDriveSchema);