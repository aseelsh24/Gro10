import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Settings = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    language: settings.language,
    currency: settings.currency,
    tax_rate: settings.tax_rate,
    company_name: settings.company_name,
    receipt_footer: settings.receipt_footer,
    theme: settings.theme
  });

  useEffect(() => {
    setFormData({
      language: settings.language,
      currency: settings.currency,
      tax_rate: settings.tax_rate,
      company_name: settings.company_name,
      receipt_footer: settings.receipt_footer,
      theme: settings.theme
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSettings(formData);
      toast.success(t('settings_updated'));
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(t('error_updating_settings'));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">{t('admin_only')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-900">
        {t('settings')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-neumorph space-y-4">
          {/* اللغة */}
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('language')}
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* العملة */}
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('currency')}
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="SAR">SAR (ر.س)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* نسبة الضريبة */}
          {/* Tax rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('tax_rate')}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.tax_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: Number(e.target.value) }))}
                className="block w-full pl-3 pr-12 py-2 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* اسم الشركة */}
          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('company_name')}
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* تذييل الفاتورة */}
          {/* Receipt footer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('receipt_footer')}
            </label>
            <textarea
              value={formData.receipt_footer}
              onChange={(e) => setFormData(prev => ({ ...prev, receipt_footer: e.target.value }))}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* المظهر */}
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('theme')}
            </label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="light">{t('theme_light')}</option>
              <option value="dark">{t('theme_dark')}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? t('saving') : t('save_changes')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;