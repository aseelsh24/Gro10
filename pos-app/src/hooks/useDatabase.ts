import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);

  // دالة عامة للتعامل مع عمليات قاعدة البيانات
  // Generic function to handle database operations
  const handleDatabaseOperation = useCallback(async (
    operation: () => Promise<any>,
    successMessage?: string
  ) => {
    setLoading(true);
    try {
      const result = await operation();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      console.error('Database operation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Operation failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // عمليات المنتجات
  // Product operations
  const products = {
    getAll: () => handleDatabaseOperation(
      () => window.electron.database.getProducts()
    ),
    add: (product: any) => handleDatabaseOperation(
      () => window.electron.database.addProduct(product),
      'Product added successfully'
    ),
    update: (product: any) => handleDatabaseOperation(
      () => window.electron.database.updateProduct(product),
      'Product updated successfully'
    ),
    delete: (id: number) => handleDatabaseOperation(
      () => window.electron.database.deleteProduct(id),
      'Product deleted successfully'
    ),
  };

  // عمليات المبيعات
  // Sales operations
  const sales = {
    create: (sale: any) => handleDatabaseOperation(
      () => window.electron.sales.createSale(sale),
      'Sale completed successfully'
    ),
    getAll: (filters?: any) => handleDatabaseOperation(
      () => window.electron.sales.getSales(filters)
    ),
  };

  return {
    loading,
    products,
    sales,
  };
};