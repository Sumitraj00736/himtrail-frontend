import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const DepartingSoonTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/content/departing-soon').then((res) => {
      setRows(res.data.data || []);
    });
  }, []);

  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e6efff] text-[#243b75] flex items-center justify-center text-2xl">
              🗓
            </div>
            <div>
              <p className="text-[#243b75] text-2xl font-semibold">DEPARTING SOON!</p>
              <p className="text-sm text-slate-500">Exclusive Deals 2026/27</p>
            </div>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-sunrise-500 text-sunrise-500 font-semibold inline-flex items-center gap-2"
          >
            Explore more →
          </Link>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border">
          <div className="grid grid-cols-12 px-6 py-4 text-sm text-slate-500 font-semibold">
            <div className="col-span-4">Trip Name</div>
            <div className="col-span-4">Departure Date</div>
            <div className="col-span-2">Trip Status</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1"></div>
          </div>
          {rows.map((row) => (
            <div
              key={row._id}
              className="grid grid-cols-12 px-6 py-5 border-t text-sm text-slate-700 items-center"
            >
              <div className="col-span-4 font-semibold">{row.tripName}</div>
              <div className="col-span-4">{row.startDate} - {row.endDate}</div>
              <div className="col-span-2 text-forest-800 font-semibold">
                {row.status}
              </div>
              <div className="col-span-1 font-semibold">{row.price}</div>
              <div className="col-span-1">
                <Link
                  to="/booking"
                  className="px-4 py-2 rounded-full border border-sunrise-500 text-sunrise-500 font-semibold text-xs"
                >
                  Enquire now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartingSoonTable;
