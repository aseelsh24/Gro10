import { contextBridge, ipcRenderer } from 'electron';

// تعريف الواجهة البرمجية المتاحة للتطبيق
// Define API available to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // واجهة قاعدة البيانات
  // Database interface
  database: {
    // مثال على جلب المنتجات
    // Example: fetch products
    getProducts: () => ipcRenderer.invoke('get-products'),
    
    // إضافة منتج جديد
    // Add new product
    addProduct: (product: any) => ipcRenderer.invoke('add-product', product),
    
    // تحديث منتج
    // Update product
    updateProduct: (product: any) => ipcRenderer.invoke('update-product', product),
    
    // حذف منتج
    // Delete product
    deleteProduct: (id: number) => ipcRenderer.invoke('delete-product', id),
  },

  // واجهة المبيعات
  // Sales interface
  sales: {
    // إنشاء عملية بيع جديدة
    // Create new sale
    createSale: (sale: any) => ipcRenderer.invoke('create-sale', sale),
    
    // جلب المبيعات
    // Fetch sales
    getSales: (filters: any) => ipcRenderer.invoke('get-sales', filters),
  },

  // واجهة المستخدمين
  // Users interface
  users: {
    // تسجيل الدخول
    // Login
    login: (credentials: any) => ipcRenderer.invoke('login', credentials),
    
    // تسجيل الخروج
    // Logout
    logout: () => ipcRenderer.invoke('logout'),
  },

  // واجهة الإعدادات
  // Settings interface
  settings: {
    // جلب الإعدادات
    // Get settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    
    // تحديث الإعدادات
    // Update settings
    updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  }
});