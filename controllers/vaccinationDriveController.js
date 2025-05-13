const VaccinationDrive = require('../models/vaccinationdrive');
const Student = require('../models/student'); // Import Student model

// Create a new vaccination drive
const createVaccinationDrive = async (req, res) => {
    try {
        const { date, ...driveData } = req.body;

        // Date validation: At least 15 days in advance
        const driveDate = new Date(date);
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() + 15));

        if (driveDate < minDate) {
            return res.status(400).json({ message: 'Vaccination drive must be scheduled at least 15 days in advance' });
        }

        // Check for overlapping drives (basic check)
        const overlappingDrive = await VaccinationDrive.findOne({
            date: driveDate, // Check for same date.  For more robust checking, check time ranges.
        });
        if (overlappingDrive) {
            return res.status(400).json({ message: 'Another vaccination drive is already scheduled for this date' });
        }


        const vaccinationDrive = new VaccinationDrive({ ...driveData, date: driveDate });
        await vaccinationDrive.save();
        res.status(201).json(vaccinationDrive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all vaccination drives
const getAllVaccinationDrives = async (req, res) => {
    try {
        const vaccinationDrives = await VaccinationDrive.find();
        res.json(vaccinationDrives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single vaccination drive by ID
const getVaccinationDriveById = async (req, res) => {
    try {
        const vaccinationDrive = await VaccinationDrive.findById(req.params.id);
        if (!vaccinationDrive) {
            return res.status(404).json({ message: 'Vaccination Drive not found' });
        }
        res.json(vaccinationDrive);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a vaccination drive by ID
const updateVaccinationDrive = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;

        const existingDrive = await VaccinationDrive.findById(id);
        if (!existingDrive) {
            return res.status(404).json({ message: 'Vaccination Drive not found' });
        }

        // Prevent editing if the drive date has passed
        if (existingDrive.date < new Date()) {
            return res.status(400).json({ message: 'Cannot edit a past vaccination drive' });
        }
         if (date) {
            const driveDate = new Date(date);
            const today = new Date();
            const minDate = new Date(today.setDate(today.getDate() + 15));
             if (driveDate < minDate) {
                 return res.status(400).json({ message: 'Vaccination drive must be scheduled at least 15 days in advance' });
             }
         }
        const vaccinationDrive = await VaccinationDrive.findByIdAndUpdate(id, req.body, { new: true });
        if (!vaccinationDrive) {
            return res.status(404).json({ message: 'Vaccination Drive not found' });
        }
        res.json(vaccinationDrive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a vaccination drive by ID
const deleteVaccinationDrive = async (req, res) => {
    try {
        const vaccinationDrive = await VaccinationDrive.findByIdAndDelete(req.params.id);
        if (!vaccinationDrive) {
            return res.status(404).json({ message: 'Vaccination Drive not found' });
        }
        res.json({ message: 'Vaccination Drive deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVaccinationDrive,
    getAllVaccinationDrives,
    getVaccinationDriveById,
    updateVaccinationDrive,
    deleteVaccinationDrive,
};