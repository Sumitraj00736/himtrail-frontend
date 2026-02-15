import { NavLink, Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/trips', label: 'Trips' },
  { to: '/dashboard/bookings', label: 'Bookings' },
  { to: '/dashboard/reviews', label: 'Reviews' },
  { to: '/dashboard/departing-soon', label: 'Departing Soon' },
  { to: '/dashboard/best-sellers', label: 'Best Sellers' },
  { to: '/dashboard/featured-trips', label: 'Featured Trips' },
  { to: '/dashboard/homepage', label: 'Homepage' },
  { to: '/dashboard/menus', label: 'Menus' },
];

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const allowed = user?.role === 'Admin' || user?.role === 'Staff';

  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-[#243b75]">Admin Login Required</h1>
          <p className="text-slate-500 mt-2">
            Please login with an Admin or Staff account to access the dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-[#243b75] text-white"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="bg-white rounded-2xl shadow-sm border p-4 h-fit">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-[#243b75] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="bg-white rounded-2xl shadow-sm border p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
