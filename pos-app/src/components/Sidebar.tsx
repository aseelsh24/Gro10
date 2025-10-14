import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdPointOfSale,
  MdInventory,
  MdPeople,
  MdInsertChart,
  MdSettings
} from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: MdDashboard, label: t('dashboard'), role: ['admin', 'cashier'] },
    { path: '/pos', icon: MdPointOfSale, label: t('pos'), role: ['admin', 'cashier'] },
    { path: '/products', icon: MdInventory, label: t('products'), role: ['admin'] },
    { path: '/customers', icon: MdPeople, label: t('customers'), role: ['admin', 'cashier'] },
    { path: '/reports', icon: MdInsertChart, label: t('reports'), role: ['admin'] },
    { path: '/settings', icon: MdSettings, label: t('settings'), role: ['admin'] }
  ];

  return (
    <motion.aside
      className="w-64 bg-white shadow-neumorph"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* شعار التطبيق */}
      {/* App logo */}
      <div className="h-16 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-primary-600">POS App</h1>
      </div>

      {/* قائمة التنقل */}
      {/* Navigation menu */}
      <nav className="mt-8">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => 
            item.role.includes(user?.role || '') && (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) => `
                  flex items-center px-4 py-2 text-sm rounded-lg
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700 shadow-neumorph-inset' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="mr-3 text-xl" />
                {item.label}
              </NavLink>
            )
          )}
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;