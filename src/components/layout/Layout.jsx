import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollAnimation } from '../../utils/useScrollAnimation';

const Layout = ({ children }) => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-sunrise-200 selection:text-sunrise-600">
      <Navbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
