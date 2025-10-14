import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { settings, toggleLanguage } = useSettings();
  const { t } = useTranslation();

  return (
    <motion.header 
      className="bg-white shadow-neumorph"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {settings.company_name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* زر تغيير اللغة */}
            {/* Language toggle */}
            <button
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={toggleLanguage}
            >
              {settings.language === 'ar' ? 'English' : 'عربي'}
            </button>

            {/* معلومات المستخدم */}
            {/* User info */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{user?.username}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;