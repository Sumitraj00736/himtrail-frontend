import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicMenu = () => {
  const [menus, setMenus] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    api.get('/content/menus').then((res) => {
      setMenus(res.data.data || []);
    });
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="xl:hidden flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border rounded-md border-slate-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 z-50 relative"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden xl:flex items-center gap-7 text-sm">
        {menus.map((menu) => (
          <div key={menu._id} className="relative group">
            <button className="font-semibold text-slate-700 hover:text-forest-800">
              {menu.label}
            </button>
            <div className="absolute left-0 top-full mt-1 opacity-0 pointer-events-none delay-[450ms] group-hover:delay-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              {menu.style === 'list' ? (
                <div className="bg-white rounded-3xl p-6 w-80 shadow-xl border border-slate-100">
                  {menu.columns.map((col) => (
                    <div key={col.title} className="mb-4">
                      <p className="text-forest-800 font-semibold mb-2">{col.title}</p>
                      <ul className="space-y-2 text-sm text-forest-700">
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <Link to={item.href} className="hover:text-forest-800 transition-colors duration-150">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 w-[980px] shadow-xl grid grid-cols-4 gap-8 text-forest-700 max-h-[70vh] overflow-y-auto border border-slate-100">
                  {menu.columns.map((col) => (
                    <div key={col.title}>
                      <p className="text-forest-800 font-semibold mb-3">{col.title}</p>
                      <ul className="space-y-2 text-sm">
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <Link to={item.href} className="hover:text-forest-800 transition-colors duration-150">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile Side Slider Menu - Portal Style */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="xl:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[9999] overflow-y-auto"
              style={{ position: 'fixed', height: '100vh', height: '100dvh' }}
            >
              {/* Close Button */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
                <h2 className="text-lg font-semibold text-forest-800">Menu</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-md transition-colors duration-150"
                >
                  ✕
                </button>
              </div>

              {/* Menu Content */}
              <div className="p-4">
                {menus.map((menu, index) => (
                  <div key={menu._id} className="border-b border-slate-100 last:border-none">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="w-full px-2 py-3 flex justify-between items-center font-semibold text-forest-800 hover:bg-slate-50 rounded-md transition-colors duration-150"
                    >
                      {menu.label}
                      <span className="text-sm">{expandedIndex === index ? '▲' : '▼'}</span>
                    </button>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pr-2 py-2">
                            {menu.columns.map((col) => (
                              <div key={col.title} className="mb-4">
                                <p className="text-sm font-medium text-forest-700 mb-2">{col.title}</p>
                                <ul className="space-y-2 text-sm text-forest-700">
                                  {col.items.map((item) => (
                                    <li key={item.label}>
                                      <Link
                                        to={item.href}
                                        className="hover:text-forest-800 block py-1 transition-colors duration-150"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DynamicMenu;