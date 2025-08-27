import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";
import BackupService from "../services/backup.service.js";

// Get user settings
export const getUserSettings = async (req, res) => {
    try {
        const { id } = req.user;
        
        // Find user
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find or create settings for user
        let userSettings = await Settings.findOne({ userId: id });
        
        if (!userSettings) {
            // Create default settings if none exist
            userSettings = new Settings({
                userId: id,
                personalInfo: {
                    name: user.fullname || "Dr. Dylan",
                    email: user.email || "dr.dylan@kfh.rw",
                    phone: user.phone || "+250 788 123 456",
                    role: user.role || "Pharmacist"
                }
            });
            await userSettings.save();
        }

        const settings = {
            personalInfo: userSettings.personalInfo,
            preferences: userSettings.preferences,
            notifications: userSettings.notifications,
            backupConfig: userSettings.backupConfig
        };

        return res.status(200).json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
    try {
        const { id } = req.user;
        const { personalInfo, preferences, notifications, backupConfig } = req.body;
        
        // Find existing settings or create new ones
        let userSettings = await Settings.findOne({ userId: id });
        
        if (!userSettings) {
            userSettings = new Settings({ userId: id });
        }

        // Update settings with provided data
        if (personalInfo) {
            userSettings.personalInfo = { ...userSettings.personalInfo, ...personalInfo };
        }
        
        if (preferences) {
            userSettings.preferences = { ...userSettings.preferences, ...preferences };
            
            // Update user language preference in User model for global app language
            if (preferences.language) {
                await User.findByIdAndUpdate(id, { language: preferences.language });
            }
        }
        
        if (notifications) {
            userSettings.notifications = { ...userSettings.notifications, ...notifications };
        }
        
        if (backupConfig) {
            userSettings.backupConfig = { ...userSettings.backupConfig, ...backupConfig };
        }

        // Save updated settings
        await userSettings.save();
        
        console.log('Settings updated for user:', id);
        
        return res.status(200).json({ 
            message: "Settings updated successfully",
            settings: {
                personalInfo: userSettings.personalInfo,
                preferences: userSettings.preferences,
                notifications: userSettings.notifications,
                backupConfig: userSettings.backupConfig
            }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get backup configuration
const getBackupConfiguration = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Get user settings
    const userSettings = await Settings.findOne({ userId: id });
    const backupConfig = userSettings?.backupConfig || {
      frequency: "Daily",
      retentionDays: 30,
      location: "Cloud Storage",
      autoBackup: true,
      backupTime: "02:30"
    };
    
    return res.status(200).json({ 
      configuration: {
        ...backupConfig,
        compressionEnabled: true,
        encryptionEnabled: true
      }
    });
  } catch (error) {
    console.error('Get backup configuration error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update backup configuration
const updateBackupConfiguration = async (req, res) => {
  try {
    const { id } = req.user;
    const { frequency, retentionDays, location, autoBackup, backupTime } = req.body;
    
    // Update user settings
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          'backupConfig.frequency': frequency || 'Daily',
          'backupConfig.retentionDays': retentionDays || 30,
          'backupConfig.location': location || 'Cloud Storage',
          'backupConfig.autoBackup': autoBackup ?? true,
          'backupConfig.backupTime': backupTime || '02:30'
        }
      },
      { new: true, upsert: true }
    );
    
    // Schedule backup if auto backup is enabled
    if (autoBackup) {
      await BackupService.scheduleBackup(id, frequency);
    }
    
    console.log('Backup configuration updated for user:', id);
    
    return res.status(200).json({ 
      message: "Backup configuration updated successfully",
      configuration: {
        ...updatedSettings.backupConfig,
        compressionEnabled: true,
        encryptionEnabled: true,
        lastModified: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Update backup configuration error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get backup status
export const getBackupStatus = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Get user settings for backup configuration
    const userSettings = await Settings.findOne({ userId: id });
    const backupConfig = userSettings?.backupConfig || {
      frequency: "Daily",
      retentionDays: 30,
      location: "Cloud Storage",
      autoBackup: true
    };

    // Get real database stats
    const dbStats = await BackupService.getDatabaseStats();
    
    // Get backup history
    const backupHistory = await BackupService.getBackupHistory();
    const lastBackup = backupHistory[0];
    
    const backupStatus = {
      configuration: backupConfig,
      systemStatus: {
        lastBackup: lastBackup ? {
          date: lastBackup.createdAt.toISOString().split('T')[0],
          time: lastBackup.createdAt.toLocaleTimeString(),
          status: "Success",
          size: lastBackup.size
        } : {
          date: "Never",
          time: "--",
          status: "No backups found"
        },
        databaseSize: dbStats.databaseSize,
        storageUsage: {
          used: Math.min(Math.floor(Math.random() * 80) + 20, 95), // Simulated usage
          total: 100,
          status: "Normal"
        },
        collections: dbStats.collections,
        documents: dbStats.documents
      },
      backupHistory: backupHistory.slice(0, 5) // Last 5 backups
    };
    
    return res.status(200).json({ backup: backupStatus });
  } catch (error) {
    console.error('Get backup status error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Initiate backup
export const initiateBackup = async (req, res) => {
  try {
    const { id } = req.user;
    
    console.log(`Backup initiated by user: ${id}`);
    
    // Create actual database backup
    const backupResult = await BackupService.createDatabaseBackup(id);
    
    if (backupResult.success) {
      // Update user settings with last backup info
      await Settings.findOneAndUpdate(
        { userId: id },
        { 
          $set: { 
            'backupConfig.lastBackup': {
              date: new Date(),
              status: 'Success',
              size: backupResult.size
            }
          }
        },
        { upsert: true }
      );
      
      return res.status(200).json({ 
        backup: {
          status: "completed",
          backupId: backupResult.backupId,
          message: "Backup completed successfully",
          timestamp: backupResult.timestamp,
          fileName: backupResult.fileName,
          size: backupResult.size,
          steps: [
            { step: "Database dump", status: "completed" },
            { step: "File compression", status: "completed" },
            { step: "Save to storage", status: "completed" },
            { step: "Cleanup", status: "completed" }
          ]
        }
      });
    } else {
      throw new Error('Backup creation failed');
    }
  } catch (error) {
    console.error('Initiate backup error:', error);
    return res.status(500).json({ 
      message: "Backup failed",
      error: error.message 
    });
  }
};

// Get backup history
export const getBackupHistory = async (req, res) => {
  try {
    const backupHistory = await BackupService.getBackupHistory();
    return res.status(200).json({ history: backupHistory });
  } catch (error) {
    console.error('Get backup history error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete backup
export const deleteBackup = async (req, res) => {
  try {
    const { fileName } = req.params;
    const result = await BackupService.deleteBackup(fileName);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Delete backup error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Restore backup
export const restoreBackup = async (req, res) => {
  try {
    const { fileName } = req.body;
    const backupHistory = await BackupService.getBackupHistory();
    const backup = backupHistory.find(b => b.fileName === fileName);
    
    if (!backup) {
      return res.status(404).json({ message: "Backup file not found" });
    }
    
    const result = await BackupService.restoreDatabase(backup.filePath);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Restore backup error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Download backup file
export const downloadBackup = async (req, res) => {
  try {
    const { fileName } = req.params;
    const backupHistory = await BackupService.getBackupHistory();
    const backup = backupHistory.find(b => b.fileName === fileName);
    
    if (!backup) {
      return res.status(404).json({ message: "Backup file not found" });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/json');
    
    // Send file
    res.sendFile(backup.filePath);
  } catch (error) {
    console.error('Download backup error:', error);
    return res.status(500).json({ message: error.message });
  }
};


export {  getBackupConfiguration,  updateBackupConfiguration };
