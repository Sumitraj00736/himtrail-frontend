import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/content/reviews').then((res) => {
      setReviews(res.data.data || []);
    });
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#243b75] text-2xl font-semibold">WHAT OUR CLIENTS SAY?</p>
            <p className="text-slate-500">Client Reviews</p>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-sunrise-500 text-sunrise-500 font-semibold"
          >
            View all reviews →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {reviews.slice(0, 2).map((review) => (
            <div key={review._id} className="bg-slate-50 rounded-2xl p-6 border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#243b75] text-white flex items-center justify-center font-semibold">
                  {review.authorName?.[0] || 'R'}
                </div>
                <div>
                  <p className="font-semibold">{review.title}</p>
                  <p className="text-sm text-slate-500">
                    {review.authorName}, {review.publishedDate}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sunrise-500">{'★'.repeat(review.rating || 5)}</div>
              <p className="mt-4 text-slate-600">{review.body}</p>
              <button className="mt-2 text-[#243b75] text-sm font-semibold">+ read more</button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-10 text-slate-500 text-sm">
          <span>Tripadvisor ★★★★★ 300+ Reviews</span>
          <span>Google ★★★★★ 100+ Reviews</span>
          <span>Trustpilot ★★★★★ 99+ Reviews</span>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
