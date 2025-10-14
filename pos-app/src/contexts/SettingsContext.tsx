import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Settings {
  language: string;
  currency: string;
  tax_rate: number;
  company_name: string;
  receipt_footer: string;
  theme: 'light' | 'dark';
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  toggleLanguage: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>({
    language: 'ar',
    currency: 'SAR',
    tax_rate: 15,
    company_name: 'POS System',
    receipt_footer: 'شكراً لزيارتكم - Thank you for your visit',
    theme: 'light'
  });

  useEffect(() => {
    // تحميل الإعدادات عند بدء التطبيق
    // Load settings on app start
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await window.electron.settings.getSettings();
      setSettings(savedSettings);
      i18n.changeLanguage(savedSettings.language);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await window.electron.settings.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      
      if (newSettings.language) {
        i18n.changeLanguage(newSettings.language);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const toggleLanguage = () => {
    const newLang = settings.language === 'ar' ? 'en' : 'ar';
    updateSettings({ language: newLang });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};