import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-forest-50 text-forest-900">
    <Navbar />
    <main className="pt-28">{children}</main>
    <Footer />
  </div>
);

export default Layout;
