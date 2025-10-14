export interface IElectronAPI {
  database: {
    getProducts: () => Promise<any[]>;
    addProduct: (product: any) => Promise<void>;
    updateProduct: (product: any) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getCustomers: () => Promise<any[]>;
    addCustomer: (customer: any) => Promise<void>;
    updateCustomer: (customer: any) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
  };
  sales: {
    createSale: (sale: any) => Promise<void>;
    getSales: (filters?: any) => Promise<any[]>;
  };
  users: {
    login: (credentials: { username: string; password: string }) => Promise<{
      success: boolean;
      user?: any;
      message?: string;
    }>;
    logout: () => Promise<void>;
  };
  settings: {
    getSettings: () => Promise<any>;
    updateSettings: (settings: any) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}