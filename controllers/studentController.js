const Student = require('../models/student');
const VaccinationDrive = require('../models/vaccinationdrive');
const csvParser = require('../utils/csvParser'); // Import the CSV parser

// Add a new student
const addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a student by ID
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk import students from CSV
const importStudentsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const students = await csvParser.parseCSV(req.file.buffer); // Use the parser
    //console.log(students); //debug
    await Student.insertMany(students);
    res.status(201).json({ message: 'Students imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error importing students', error: error.message });
  }
};

// Mark a student as vaccinated in a drive
const vaccinateStudent = async (req, res) => {
    try {
        const { studentId, driveId } = req.body;

        const student = await Student.findOne({ studentId });
        const drive = await VaccinationDrive.findById(driveId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (!drive) {
            return res.status(404).json({ message: 'Vaccination Drive not found' });
        }

        // Check if the student has already been vaccinated for this drive
        const alreadyVaccinated = student.vaccinationStatus.some(
            (v) => v.driveId.toString() === driveId
        );
        if (alreadyVaccinated) {
            return res.status(400).json({ message: 'Student already vaccinated for this drive' });
        }
        if (drive.availableDoses <= 0) {
            return res.status(400).json({ message: 'No doses available for this drive' });
        }

        // Update student's vaccination status
        student.vaccinationStatus.push({
            vaccineName: drive.vaccineName, // Get vaccine name from the drive
            date: new Date(),
            driveId: drive._id,
        });
        await student.save();

        // Update the vaccination drive
        drive.availableDoses -= 1;
        drive.studentsVaccinated.push({ student: student._id, date: new Date() }); //track
        await drive.save();

        res.json({ message: 'Student vaccinated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get vaccination report for a student
const getVaccinationReport = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findOne({ studentId }).populate('vaccinationStatus.driveId'); // Populate the drive details
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const report = student.vaccinationStatus.map(v => ({
      vaccineName: v.vaccineName,
      date: v.date,
      driveDate: v.driveId ? v.driveId.date : 'N/A', // Access drive date
      driveId: v.driveId ? v.driveId._id: 'N/A'
    }));
    res.json(report);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// Get aggregate data for dashboard
const getDashboardData = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const vaccinatedStudents = await Student.aggregate([
          {
            $match: {
              vaccinationStatus: { $ne: [] } //  students with at least one vaccination
            }
          },
          {
            $count: "count"
          }
        ]);
        const upcomingDrives = await VaccinationDrive.find({
            date: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // Within 30 days
        }).sort({ date: 1 });

        const vaccinatedCount = vaccinatedStudents.length > 0 ? vaccinatedStudents[0].count : 0;
        const vaccinationPercentage = totalStudents > 0 ? (vaccinatedCount / totalStudents) * 100 : 0;


        res.json({
            totalStudents,
            vaccinatedStudents: vaccinatedCount,
            vaccinationPercentage: vaccinationPercentage.toFixed(2),
            upcomingDrives,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    importStudentsFromCSV,
    vaccinateStudent,
    getVaccinationReport,
    getDashboardData
};