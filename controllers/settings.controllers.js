import User from "../models/user.model.js";

// user settings
export const getUserSettings = async (req, res) => {
    try {
        const userId = req.user?.id || req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const settings = {
            personalInfo: {
                name: user.name || "John Doe",
                email: user.email || "info@byoo.rw",
                phone: user.phone || "+250 788 123 456",
                role: user.role || "admin"
            },
            preferences: {
                currency: user.currency || "RWF",
                language: user.language || "English",
                timezone: user.timezone || "Africa/Kigali",
                dateFormat: user.dateFormat || "DD/MM/YYYY"
            },
            notifications: {
                emailNotifications: user.emailNotifications ?? true,
                smsNotifications: user.smsNotifications ?? false,
                lowStockAlerts: user.lowStockAlerts ?? true,
                expiryAlerts: user.expiryAlerts ?? true
            }
        };

        return res.status(200).json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Updating user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { personalInfo, preferences, notifications, backupConfig } = req.body;
    
   
    const updatedSettings = {
      personalInfo: {
        name: personalInfo?.name || "Dr. Dylan",
        email: personalInfo?.email || "dr.dylan@kfh.rw",
        phone: personalInfo?.phone || "+250 788 123 456",
        role: "Pharmacist"
      },
      preferences: {
        currency: preferences?.currency || "RWF",
        language: preferences?.language || "English",
        timezone: preferences?.timezone || "Africa/Kigali",
        dateFormat: preferences?.dateFormat || "DD/MM/YYYY"
      },
      notifications: {
        emailNotifications: notifications?.emailNotifications ?? true,
        smsNotifications: notifications?.smsNotifications ?? false,
        lowStockAlerts: notifications?.lowStockAlerts ?? true,
        expiryAlerts: notifications?.expiryAlerts ?? true
      },
      backupConfig: {
        frequency: backupConfig?.frequency || "Daily",
        retentionDays: backupConfig?.retentionDays || 30,
        location: backupConfig?.location || "Cloud Storage",
        autoBackup: backupConfig?.autoBackup ?? true
      }
    };
    
   
    console.log('Backup configuration updated:', updatedSettings.backupConfig);
    
    return res.status(200).json({ 
      message: "Settings updated successfully",
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// backup configuration
const getBackupConfiguration = async (req, res) => {
  try {
    
    const backupConfig = {
      frequency: "Daily",
      retentionDays: 30,
      location: "Cloud Storage",
      autoBackup: true,
      backupTime: "02:30",
      compressionEnabled: true,
      encryptionEnabled: true
    };
    
    return res.status(200).json({ configuration: backupConfig });
  } catch (error) {
    console.error('Get backup configuration error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update backup configuration
const updateBackupConfiguration = async (req, res) => {
  try {
    const { frequency, retentionDays, location, autoBackup, backupTime } = req.body;
    
    
    const updatedConfig = {
      frequency: frequency || "Daily",
      retentionDays: retentionDays || 30,
      location: location || "Cloud Storage",
      autoBackup: autoBackup ?? true,
      backupTime: backupTime || "02:30",
      compressionEnabled: true,
      encryptionEnabled: true,
      lastModified: new Date().toISOString()
    };
    
    console.log('Backup configuration updated:', updatedConfig);
    
    return res.status(200).json({ 
      message: "Backup configuration updated successfully",
      configuration: updatedConfig 
    });
  } catch (error) {
    console.error('Update backup configuration error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get backup status
export const getBackupStatus = async (req, res) => {
  try {
    
    const now = new Date();
    const lastBackupDate = new Date(now.getTime() - (24 * 60 * 60 * 1000)); 
    
    const backupStatus = {
      configuration: {
        frequency: "Daily",
        retentionDays: 30,
        location: "Cloud Storage",
        autoBackup: true
      },
      systemStatus: {
        lastBackup: {
          date: lastBackupDate.toISOString().split('T')[0],
          time: "02:30 AM",
          status: "Success"
        },
        databaseSize: "2.4 GB",
        storageUsage: {
          used: 65,
          total: 100,
          status: "Normal"
        }
      }
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
    
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    console.log(`Backup initiated: ${backupId} at ${timestamp}`);
    
   
    setTimeout(() => {
      console.log(`Backup ${backupId}: Database dump completed`);
    }, 2000);
    
    setTimeout(() => {
      console.log(`Backup ${backupId}: Files compressed and uploaded`);
    }, 5000);
    
    const backupResult = {
      status: "initiated",
      backupId: backupId,
      message: "Backup process started successfully",
      timestamp: timestamp,
      estimatedCompletion: new Date(Date.now() + 8 * 60 * 1000).toISOString(), 
      steps: [
        { step: "Database dump", status: "in_progress" },
        { step: "File compression", status: "pending" },
        { step: "Upload to storage", status: "pending" },
        { step: "Cleanup", status: "pending" }
      ]
    };
    
    return res.status(200).json({ backup: backupResult });
  } catch (error) {
    console.error('Initiate backup error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {  getBackupConfiguration,  updateBackupConfiguration };
