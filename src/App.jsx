import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import DashboardLayout from './dashboard/components/DashboardLayout';
import DashboardHome from './dashboard/pages/DashboardHome';
import TripsAdmin from './dashboard/pages/TripsAdmin';
import BookingsAdmin from './dashboard/pages/BookingsAdmin';
import ReviewsAdmin from './dashboard/pages/ReviewsAdmin';
import DepartingSoonAdmin from './dashboard/pages/DepartingSoonAdmin';
import BestSellersAdmin from './dashboard/pages/BestSellersAdmin';
import FeaturedTripsAdmin from './dashboard/pages/FeaturedTripsAdmin';
import HomepageAdmin from './dashboard/pages/HomepageAdmin';
import MenusAdmin from './dashboard/pages/MenusAdmin';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/:slug" element={<TripDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="trips" element={<TripsAdmin />} />
        <Route path="bookings" element={<BookingsAdmin />} />
        <Route path="reviews" element={<ReviewsAdmin />} />
        <Route path="departing-soon" element={<DepartingSoonAdmin />} />
        <Route path="best-sellers" element={<BestSellersAdmin />} />
        <Route path="featured-trips" element={<FeaturedTripsAdmin />} />
        <Route path="homepage" element={<HomepageAdmin />} />
        <Route path="menus" element={<MenusAdmin />} />
      </Route>
    </Routes>
  </Layout>
);

export default App;
