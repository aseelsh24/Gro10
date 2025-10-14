import { contextBridge, ipcRenderer } from 'electron';

// تعريف واجهة برمجة التطبيق (API) المتاحة للتطبيق
// Define API available to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // واجهة قاعدة البيانات
  // Database interface
  database: {
    // جلب المنتجات
    // Fetch products
    getProducts: () => ipcRenderer.invoke('get-products'),
    addProduct: (product: any) => ipcRenderer.invoke('add-product', product),
    updateProduct: (product: any) => ipcRenderer.invoke('update-product', product),
    deleteProduct: (id: number) => ipcRenderer.invoke('delete-product', id),
    // العملاء
    // Customers
    getCustomers: () => ipcRenderer.invoke('get-customers'),
    addCustomer: (customer: any) => ipcRenderer.invoke('add-customer', customer),
    updateCustomer: (customer: any) => ipcRenderer.invoke('update-customer', customer),
    deleteCustomer: (id: number) => ipcRenderer.invoke('delete-customer', id),
  },

  // واجهة المبيعات
  // Sales interface
  sales: {
    createSale: (sale: any) => ipcRenderer.invoke('create-sale', sale),
    getSales: (filters: any) => ipcRenderer.invoke('get-sales', filters),
  },

  // واجهة المستخدمين
  // Users interface
  users: {
    login: (credentials: any) => ipcRenderer.invoke('login', credentials),
    logout: () => ipcRenderer.invoke('logout'),
  },

  // واجهة الإعدادات
  // Settings interface
  settings: {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  },
});