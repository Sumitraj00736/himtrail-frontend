import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const DynamicMenu = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('/content/menus').then((res) => {
      setMenus(res.data.data || []);
    });
  }, []);

  return (
    <nav className="hidden xl:flex items-center gap-7 text-sm">
      {menus.map((menu) => (
        <div key={menu._id} className="relative group">
          <button className="font-semibold text-slate-700 hover:text-forest-800">
            {menu.label}
          </button>
          <div className="absolute left-0 top-full mt-1 opacity-0 pointer-events-none delay-[450ms] group-hover:delay-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
            {menu.style === 'list' ? (
              <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
                {menu.columns.map((col) => (
                  <div key={col.title} className="mb-4">
                    <p className="text-forest-800 font-semibold mb-2">{col.title}</p>
                    <ul className="space-y-2 text-sm text-forest-700">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link to={item.href} className="hover:text-forest-800">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 w-[980px] shadow-xl grid grid-cols-4 gap-8 text-forest-700 max-h-[70vh] overflow-y-auto">
                {menu.columns.map((col) => (
                  <div key={col.title}>
                    <p className="text-forest-800 font-semibold mb-3">{col.title}</p>
                    <ul className="space-y-2 text-sm">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link to={item.href} className="hover:text-forest-800">
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
  );
};

export default DynamicMenu;
