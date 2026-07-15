import { NavLink, Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const mainNav = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/dashboard/trips', label: 'Trips Database', icon: '🏔️' },
  { to: '/dashboard/destinations', label: 'Destinations', icon: '📍' },
  { to: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
  { to: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
  { to: '/dashboard/homepage', label: 'Homepage Settings', icon: '⚙️' },
  { to: '/dashboard/menus', label: 'Menus', icon: '🍔' },
  { to: '/dashboard/team', label: 'Team Management', icon: '👥' },
];

const sectionNav = [
  { to: '/dashboard/featured-trips', label: 'Featured Trips' },
  { to: '/dashboard/departing-soon', label: 'Departing Soon' },
  { to: '/dashboard/best-sellers', label: 'Best Sellers' },
  { to: '/dashboard/trekking-in-nepal', label: 'Trekking in Nepal' },
  { to: '/dashboard/luxury-travel', label: 'Luxury Travel' },
];

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const allowed = user?.role === 'Admin' || user?.role === 'Staff';
  const [sectionsOpen, setSectionsOpen] = useState(true);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-10 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-500 mt-3 font-medium">
            Please login with an Admin or Staff account to access the command center.
          </p>
          <Link
            to="/login"
            className="inline-block mt-8 px-8 py-3.5 rounded-full bg-brand text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Dashboard Topbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center shadow-md shadow-brand/30 font-black text-sm">
              H
            </div>
            <span className="font-black text-slate-800 tracking-tight hidden sm:block">
              Himtrail <span className="text-brand">Admin</span>
            </span>
          </Link>

          {/* Center breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span className="text-slate-300">/</span>
            <span>Dashboard</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs font-semibold hover:border-slate-300 hover:text-slate-700 transition-all duration-200"
            >
              ← View Site
            </Link>
            <div className="flex items-center gap-2.5 bg-slate-100 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand to-blue-400 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-tight">{user?.name || user?.email || 'User'}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sunrise-500/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[260px_1fr] gap-8 relative z-10">

          {/* Sidebar */}
          <aside className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 p-5 h-fit sticky top-24">
            <div className="flex items-center gap-3 px-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center shadow-lg shadow-brand/30 text-sm font-black">
                ⚡
              </div>
              <div>
                <p className="font-bold text-slate-800 tracking-tight text-sm leading-tight">Command Center</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{user?.role} Access</p>
              </div>
            </div>

            <nav className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-brand text-white shadow-md shadow-brand/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}

              {/* Homepage Sections accordion */}
              <div className="pt-3 mt-3 border-t border-slate-200/60">
                <button
                  onClick={() => setSectionsOpen(!sectionsOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Homepage Sections
                  <span className={`transform transition-transform duration-300 text-[10px] ${sectionsOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ${sectionsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {sectionNav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 mx-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-brand/10 text-brand font-semibold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`
                      }
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 p-8 min-h-[80vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
