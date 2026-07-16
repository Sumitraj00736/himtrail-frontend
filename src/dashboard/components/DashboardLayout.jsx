import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const mainNav = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/dashboard/trips', label: 'Trips Database', icon: '🏔️' },
  { to: '/dashboard/dependencies', label: 'Dependencies', icon: '🔗' },
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

const SidebarNav = ({ collapsed, sectionsOpen, setSectionsOpen, onNavigate }) => (
  <>
    <div className={`flex items-center gap-3 mb-6 ${collapsed ? 'justify-center px-0' : 'px-3'}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center shadow-lg shadow-brand/30 text-sm font-black flex-shrink-0">
        ⚡
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="font-bold text-slate-800 tracking-tight text-sm leading-tight">Command Center</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Admin Access</p>
        </div>
      )}
    </div>

    <nav className="space-y-1">
      {mainNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          title={collapsed ? item.label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              collapsed ? 'justify-center px-2 py-2.5' : 'px-4 py-2.5'
            } ${
              isActive
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <span className="text-base flex-shrink-0">{item.icon}</span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}

      <div className={`pt-3 mt-3 border-t border-slate-200/60 ${collapsed ? 'px-0' : ''}`}>
        {!collapsed ? (
          <>
            <button
              type="button"
              onClick={() => setSectionsOpen(!sectionsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Homepage Sections
              <span
                className={`transform transition-transform duration-300 text-[10px] ${
                  sectionsOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            <div
              className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ${
                sectionsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {sectionNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
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
          </>
        ) : (
          <div className="space-y-1">
            {sectionNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center justify-center px-2 py-2.5 rounded-2xl text-sm transition-all ${
                    isActive ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:bg-slate-100'
                  }`
                }
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  </>
);

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const allowed = user?.role === 'Admin' || user?.role === 'Staff';
  const location = useLocation();

  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* ── Topbar ── */}
      <header className="flex-shrink-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="hidden lg:flex w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 items-center justify-center shadow-sm hover:bg-slate-50 hover:text-brand transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '»' : '«'}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center shadow-md shadow-brand/30 font-black text-sm">
                H
              </div>
              <span className="font-black text-slate-800 tracking-tight hidden sm:block">
                Himtrail <span className="text-brand">Admin</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span className="text-slate-300">/</span>
            <span>Dashboard</span>
          </div>

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
                <p className="text-xs font-bold text-slate-700 leading-tight">
                  {user?.name || user?.email || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body fills remaining viewport; only main scrolls ── */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Desktop sidebar — full height of remaining space */}
        <aside
          className={`hidden lg:flex flex-col flex-shrink-0 h-full z-20 border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
            collapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3">
            <SidebarNav
              collapsed={collapsed}
              sectionsOpen={sectionsOpen}
              setSectionsOpen={setSectionsOpen}
            />
          </div>
        </aside>

        {/* Mobile slide-over sidebar */}
        <div
          className={`lg:hidden fixed inset-0 z-[60] ${
            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={`absolute top-0 left-0 bottom-0 w-[min(300px,86vw)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center font-black text-sm">
                  H
                </div>
                <span className="font-black text-slate-800 text-sm">Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SidebarNav
                collapsed={false}
                sectionsOpen={sectionsOpen}
                setSectionsOpen={setSectionsOpen}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </aside>
        </div>

        {/* Main content scrolls inside viewport */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-slate-50">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
