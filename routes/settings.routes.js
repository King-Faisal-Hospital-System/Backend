import express from "express";
import { getUserSettings, updateUserSettings, getBackupStatus, initiateBackup, getBackupConfiguration, updateBackupConfiguration } from '../controllers/settings.controllers.js';

const router = express.Router();


router.get("/", getUserSettings);


router.put("/", updateUserSettings);


router.get("/backup", getBackupStatus);


router.post('/backup', initiateBackup);


router.get('/backup/config', getBackupConfiguration);


router.put('/backup/config', updateBackupConfiguration);

export default router;
