import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import DynamicMenu from './DynamicMenu';

const Navbar = () => (
  <header className="fixed top-0 w-full z-50">
    <div className="bg-gradient-to-r from-[#1e2b55] via-[#243b75] to-[#1e2b55] text-white text-xs">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sunrise-500" />
            Tourism License: 2427
          </span>
          <span className="hidden md:inline">Top 15 Trips for 2026 - read more</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">Free Travel Consultation</span>
          <span className="font-semibold">+977-9851221603</span>
        </div>
      </div>
    </div>
    <div className="bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Himtrail logo" className="w-12 h-12 object-contain" />
          <div>
            <p className="font-display text-2xl tracking-wide text-forest-800">Himtrail</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Travel & Treks</p>
          </div>
        </Link>
        <DynamicMenu />
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-full px-3 py-2 w-56 bg-white">
            <input className="w-full text-sm outline-none" placeholder="I am looking for ..." />
            <span className="text-sunrise-500">⌕</span>
          </div>
          <Link to="/dashboard" className="px-4 py-2 rounded-full bg-forest-800 text-white text-sm font-semibold">
            Dashboard
          </Link>
        </div>
        {/* <div className="xl:hidden text-xs uppercase tracking-[0.2em]">Menu</div> */}
      </div>
    </div>
  </header>
);

export default Navbar;
