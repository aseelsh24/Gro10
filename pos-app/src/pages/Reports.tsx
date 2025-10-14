import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useDatabase } from '../hooks/useDatabase';
import { useSettings } from '../hooks/useSettings';
import { jsPDF } from 'jspdf';

// تسجيل مكونات الرسم البياني
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ReportData {
  sales: any[];
  totalSales: number;
  totalTax: number;
  totalDiscount: number;
  topProducts: any[];
  dailySales: any[];
}

const Reports = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { sales: salesDB } = useDatabase();
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    end: new Date().toISOString().split('T')[0] // Today
  });
  
  const [reportData, setReportData] = useState<ReportData>({
    sales: [],
    totalSales: 0,
    totalTax: 0,
    totalDiscount: 0,
    topProducts: [],
    dailySales: []
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      const sales = await salesDB.getAll({
        startDate: dateRange.start,
        endDate: dateRange.end
      });

      // تجميع البيانات للتقرير
      // Aggregate report data
      const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
      const totalTax = sales.reduce((sum: number, sale: any) => sum + sale.tax, 0);
      const totalDiscount = sales.reduce((sum: number, sale: any) => sum + sale.discount, 0);

      // تحليل المبيعات اليومية
      // Analyze daily sales
      const dailySalesMap = new Map();
      sales.forEach((sale: any) => {
        const date = new Date(sale.created_at).toLocaleDateString();
        dailySalesMap.set(date, (dailySalesMap.get(date) || 0) + sale.total);
      });

      const dailySales = Array.from(dailySalesMap.entries()).map(([date, total]) => ({
        date,
        total
      }));

      // تحليل أفضل المنتجات مبيعاً
      // Analyze top selling products
      const productSales = new Map();
      sales.forEach((sale: any) => {
        sale.items.forEach((item: any) => {
          const current = productSales.get(item.product_id) || {
            name: item.name,
            quantity: 0,
            total: 0
          };
          current.quantity += item.quantity;
          current.total += item.price * item.quantity;
          productSales.set(item.product_id, current);
        });
      });

      const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setReportData({
        sales,
        totalSales,
        totalTax,
        totalDiscount,
        topProducts,
        dailySales
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const startY = 20;
    let currentY = startY;

    // عنوان التقرير
    // Report title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(t('sales_report'), 105, currentY, { align: 'center' });
    
    currentY += 15;
    doc.setFontSize(12);
    doc.text(`${t('date_range')}: ${dateRange.start} - ${dateRange.end}`, 105, currentY, { align: 'center' });

    // ملخص المبيعات
    // Sales summary
    currentY += 20;
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('total_sales')}: ${settings.currency} ${reportData.totalSales.toFixed(2)}`, 20, currentY);
    currentY += 10;
    doc.text(`${t('total_tax')}: ${settings.currency} ${reportData.totalTax.toFixed(2)}`, 20, currentY);
    currentY += 10;
    doc.text(`${t('total_discount')}: ${settings.currency} ${reportData.totalDiscount.toFixed(2)}`, 20, currentY);

    // أفضل المنتجات مبيعاً
    // Top selling products
    currentY += 20;
    doc.setFont('helvetica', 'bold');
    doc.text(t('top_products'), 20, currentY);
    currentY += 10;
    doc.setFont('helvetica', 'normal');
    
    reportData.topProducts.forEach((product) => {
      doc.text(`${product.name} - ${product.quantity} ${t('units')} - ${settings.currency} ${product.total.toFixed(2)}`, 30, currentY);
      currentY += 10;
    });

    // حفظ الملف
    // Save file
    doc.save(`sales-report-${dateRange.start}-${dateRange.end}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('reports')}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <span>-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {t('export_pdf')}
          </button>
        </div>
      </div>

      {/* بطاقات الملخص */}
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900">{t('total_sales')}</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {settings.currency} {reportData.totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900">{t('total_tax')}</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {settings.currency} {reportData.totalTax.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900">{t('total_discount')}</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {settings.currency} {reportData.totalDiscount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* رسم بياني المبيعات اليومية */}
        {/* Daily sales chart */}
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('daily_sales')}
          </h2>
          <div className="h-80">
            <Line
              data={{
                labels: reportData.dailySales.map(sale => sale.date),
                datasets: [{
                  label: t('sales'),
                  data: reportData.dailySales.map(sale => sale.total),
                  borderColor: 'rgb(59, 130, 246)',
                  tension: 0.1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                }
              }}
            />
          </div>
        </div>

        {/* رسم بياني أفضل المنتجات */}
        {/* Top products chart */}
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('top_products')}
          </h2>
          <div className="h-80">
            <Bar
              data={{
                labels: reportData.topProducts.map(product => product.name),
                datasets: [{
                  label: t('sales_amount'),
                  data: reportData.topProducts.map(product => product.total),
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* جدول المبيعات التفصيلي */}
      {/* Detailed sales table */}
      <div className="bg-white rounded-lg shadow-neumorph overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('invoice_no')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('total')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('payment_method')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.sales.map((sale: any) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(sale.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{sale.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.customer_name || t('guest')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {settings.currency} {sale.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {t(sale.payment_method)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Reports;