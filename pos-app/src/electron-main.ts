import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, getDatabase } from './db/init';
import isDev from 'electron-is-dev';
import * as process from 'process';
// import process from 'process'; // Removed to use Node.js global process object

let mainWindow: BrowserWindow | null = null;

// تهيئة قاعدة البيانات عند بدء التطبيق
// Initialize database on app start
app.on('ready', () => {
  try {
    initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
});

function createWindow() {
  // إنشاء النافذة الرئيسية
  // Create main window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // تحميل الصفحة الرئيسية
  // Load main page
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// تهيئة التطبيق
// Initialize app
app.on('ready', createWindow);

// إغلاق التطبيق
// Quit app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// مثال على معالجة طلب IPC
// Example IPC handler
ipcMain.handle('get-products', async () => {
  const db = getDatabase();
  const products = db.prepare('SELECT * FROM products').all();
  return products;
});