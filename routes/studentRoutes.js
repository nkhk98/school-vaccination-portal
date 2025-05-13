const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer'); // For handling file uploads
const upload = multer(); // Initialize multer

router.post('/', studentController.addStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.post('/import', upload.single('file'), studentController.importStudentsFromCSV); // CSV upload
router.post('/vaccinate', studentController.vaccinateStudent);
router.get('/report/:studentId', studentController.getVaccinationReport);
router.get('/dashboard/data', studentController.getDashboardData);

module.exports = router;
