import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    name: {
      type: String,
      default: "Dr. Dylan"
    },
    email: {
      type: String,
      default: "dr.dylan@kfh.rw"
    },
    phone: {
      type: String,
      default: "+250 788 123 456"
    },
    role: {
      type: String,
      default: "Pharmacist"
    }
  },
  preferences: {
    currency: {
      type: String,
      enum: ['RWF', 'USD', 'EUR'],
      default: 'RWF'
    },
    language: {
      type: String,
      enum: ['English', 'Kinyarwanda', 'Spanish', 'French'],
      default: 'English'
    },
    timezone: {
      type: String,
      enum: ['Africa/Kigali', 'Europe/Madrid', 'Europe/Paris', 'America/New_York'],
      default: 'Africa/Kigali'
    },
    dateFormat: {
      type: String,
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      default: 'DD/MM/YYYY'
    }
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    lowStockAlerts: {
      type: Boolean,
      default: true
    },
    expiryAlerts: {
      type: Boolean,
      default: true
    }
  },
  backupConfig: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly'],
      default: 'Daily'
    },
    retentionDays: {
      type: Number,
      min: 1,
      max: 365,
      default: 30
    },
    location: {
      type: String,
      enum: ['Cloud Storage', 'Local Storage', 'External Drive'],
      default: 'Cloud Storage'
    },
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupTime: {
      type: String,
      default: '02:30'
    }
  }
}, {
  timestamps: true
});



const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
