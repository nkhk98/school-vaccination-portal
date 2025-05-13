const express = require('express');
const router = express.Router();
const vaccinationDriveController = require('../controllers/vaccinationDriveController');

router.post('/', vaccinationDriveController.createVaccinationDrive);
router.get('/', vaccinationDriveController.getAllVaccinationDrives);
router.get('/:id', vaccinationDriveController.getVaccinationDriveById);
router.put('/:id', vaccinationDriveController.updateVaccinationDrive);
router.delete('/:id', vaccinationDriveController.deleteVaccinationDrive);

module.exports = router;
