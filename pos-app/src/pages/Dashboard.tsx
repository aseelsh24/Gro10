import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useDatabase } from '../hooks/useDatabase';
import { useSettings } from '../hooks/useSettings';

// تسجيل مكونات الرسم البياني
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { sales } = useDatabase();
  const [salesData, setSalesData] = useState<any>({
    daily: 0,
    monthly: 0,
    chartData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // جلب بيانات المبيعات
      // Fetch sales data
      const allSales = await sales.getAll();
      
      // حساب إحصائيات المبيعات
      // Calculate sales statistics
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const dailySales = allSales.filter((sale: any) => {
        const saleDate = new Date(sale.created_at);
        return saleDate.toDateString() === today.toDateString();
      });

      const monthlySales = allSales.filter((sale: any) => {
        const saleDate = new Date(sale.created_at);
        return saleDate >= firstDayOfMonth;
      });

      // إعداد بيانات الرسم البياني
      // Prepare chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      const chartData = {
        labels: last7Days.map(date => date.toLocaleDateString()),
        datasets: [{
          label: t('sales'),
          data: last7Days.map(date => {
            const daySales = allSales.filter((sale: any) => {
              const saleDate = new Date(sale.created_at);
              return saleDate.toDateString() === date.toDateString();
            });
            return daySales.reduce((sum: number, sale: any) => sum + sale.total, 0);
          }),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }]
      };

      setSalesData({
        daily: dailySales.reduce((sum: number, sale: any) => sum + sale.total, 0),
        monthly: monthlySales.reduce((sum: number, sale: any) => sum + sale.total, 0),
        chartData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-900">
        {t('dashboard')}
      </h1>

      {/* بطاقات الإحصائيات */}
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900">{t('daily_sales')}</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {settings.currency} {salesData.daily.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-neumorph">
          <h2 className="text-lg font-medium text-gray-900">{t('monthly_sales')}</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {settings.currency} {salesData.monthly.toFixed(2)}
          </p>
        </div>
      </div>

      {/* الرسم البياني */}
      {/* Sales chart */}
      <div className="bg-white p-6 rounded-lg shadow-neumorph">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t('sales_trend')}
        </h2>
        <div className="h-80">
          <Line 
            data={salesData.chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: t('last_7_days_sales')
                }
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;