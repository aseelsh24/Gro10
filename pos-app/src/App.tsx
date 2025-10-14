import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// استيراد السياقات
// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

// استيراد الصفحات
// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// استيراد المكونات
// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // تحميل الإعدادات الأولية
    // Load initial settings
    const loadInitialSettings = async () => {
      try {
        const settings = await window.electron.settings.getSettings();
        // تعيين اللغة
        // Set language
        i18n.changeLanguage(settings.language);
        // يمكن إضافة المزيد من الإعدادات هنا
        // More settings can be added here
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadInitialSettings();
  }, [i18n]);

  return (
    <AuthProvider>
      <SettingsProvider>
        {/* Toast container will be rendered automatically by react-hot-toast */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;