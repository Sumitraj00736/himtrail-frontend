const DashboardHome = () => (
  <div>
    <h1 className="text-2xl font-semibold text-[#243b75]">Dashboard Overview</h1>
    <p className="text-slate-500 mt-2">
      Manage trips, bookings, reviews, and homepage content for Himtrail.
    </p>
    <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Trips', value: 'Manage inventory' },
        { label: 'Bookings', value: 'Update statuses' },
        { label: 'Reviews', value: 'Curate testimonials' },
        { label: 'Homepage', value: 'Edit hero & sections' },
      ].map((card) => (
        <div key={card.label} className="bg-slate-50 rounded-xl p-4 border">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-[#243b75] font-semibold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardHome;
