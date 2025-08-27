import express from "express";
import { getUserSettings, updateUserSettings, getBackupStatus, initiateBackup, getBackupConfiguration, updateBackupConfiguration, getBackupHistory, deleteBackup, restoreBackup, downloadBackup } from '../controllers/settings.controllers.js';
import {authorize} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/",authorize, getUserSettings);
router.put("/", authorize, updateUserSettings);
router.get("/backup", authorize, getBackupStatus);
router.post('/backup', authorize, initiateBackup);
router.get('/backup/config', authorize, getBackupConfiguration);
router.put('/backup/config', authorize, updateBackupConfiguration);
router.get('/backup/history', authorize, getBackupHistory);
router.delete('/backup/:fileName', authorize, deleteBackup);
router.post('/backup/restore', authorize, restoreBackup);
router.get('/backup/download/:fileName', authorize, downloadBackup);

export default router;
