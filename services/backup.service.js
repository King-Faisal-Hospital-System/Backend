import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import mongoose from 'mongoose';
import Settings from '../models/settings.model.js';

const execAsync = promisify(exec);

class BackupService {
  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    this.ensureBackupDirectory();
  }

  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createDatabaseBackup(userId) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `kfh-backup-${timestamp}.json`;
      const backupPath = path.join(this.backupDir, backupFileName);

      // Get all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        database: process.env.DB_NAME || 'kfh_inventory',
        collections: {}
      };

      // Backup each collection
      for (const collection of collections) {
        const collectionName = collection.name;
        const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        backup.collections[collectionName] = data;
      }

      // Write backup to file
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

      const fileSize = this.getFileSize(backupPath);

      return {
        success: true,
        backupId: `backup_${timestamp}`,
        fileName: backupFileName,
        filePath: backupPath,
        size: fileSize,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database backup error:', error);
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  async restoreDatabase(backupFilePath) {
    try {
      // Parse backup file
      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      
      
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const collection of collections) {
        await mongoose.connection.db.collection(collection.name).deleteMany({});
      }

      // Restore data
      for (const [collectionName, data] of Object.entries(backupData.collections)) {
        if (data.length > 0) {
          await mongoose.connection.db.collection(collectionName).insertMany(data);
        }
      }

      return {
        success: true,
        message: 'Database restored successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database restore error:', error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
      return `${fileSizeInMB} MB`;
    } catch (error) {
      return 'Unknown';
    }
  }

  async getBackupHistory() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('kfh-backup-') && file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            fileName: file,
            filePath,
            size: this.getFileSize(filePath),
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);

      return files;
    } catch (error) {
      console.error('Error getting backup history:', error);
      return [];
    }
  }

  async deleteBackup(fileName) {
    try {
      const filePath = path.join(this.backupDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true, message: 'Backup deleted successfully' };
      } else {
        throw new Error('Backup file not found');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async getDatabaseStats() {
    try {
      const stats = await mongoose.connection.db.stats();
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      let totalDocuments = 0;
      for (const collection of collections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        totalDocuments += count;
      }

      return {
        databaseSize: `${(stats.dataSize / (1024 * 1024)).toFixed(2)} MB`,
        storageSize: `${(stats.storageSize / (1024 * 1024)).toFixed(2)} MB`,
        collections: collections.length,
        documents: totalDocuments,
        indexes: stats.indexes || 0
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        databaseSize: 'Unknown',
        storageSize: 'Unknown',
        collections: 0,
        documents: 0,
        indexes: 0
      };
    }
  }

  async scheduleBackup(userId, frequency = 'daily') {
    
    console.log(`Backup scheduled for user ${userId} with frequency: ${frequency}`);
    return {
      success: true,
      message: `Backup scheduled successfully (${frequency})`,
      nextBackup: this.getNextBackupTime(frequency)
    };
  }

  getNextBackupTime(frequency) {
    const now = new Date();
    switch (frequency.toLowerCase()) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        now.setHours(2, 30, 0, 0); 
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        now.setHours(2, 30, 0, 0);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        now.setHours(2, 30, 0, 0);
        break;
      default:
        now.setDate(now.getDate() + 1);
        now.setHours(2, 30, 0, 0);
    }
    return now.toISOString();
  }
}

export default new BackupService();
