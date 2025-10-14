import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* الشريط الجانبي */}
      {/* Sidebar */}
      <Sidebar />
      
      {/* المحتوى الرئيسي */}
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <motion.main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;