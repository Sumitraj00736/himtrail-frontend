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
    <section className="reveal reveal-up bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
              WHAT OUR CLIENTS SAY?
            </p>
            <h2 className="section-title mt-2 text-slate-800 font-display">Client Reviews</h2>
            <p className="text-slate-500 text-sm mt-2">Read real stories from our global community of adventurers.</p>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 self-start sm:self-auto hover:-translate-y-0.5"
          >
            View all reviews →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.slice(0, 2).map((review) => (
            <div 
              key={review._id} 
              className="relative bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:border-slate-200/50 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote Icon overlay */}
              <div className="absolute top-6 right-8 text-5xl text-brand/5 select-none font-serif">“</div>

              <div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {review.authorName?.[0] || 'R'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{review.title}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {review.authorName} · {review.publishedDate}
                    </p>
                  </div>
                </div>
                
                {/* SVG Gold Stars */}
                <div className="mt-5 flex gap-1 text-amber-500 text-xs">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                
                <p className="mt-4 text-slate-600 text-sm leading-relaxed italic">
                  "{review.body}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-brand hover:text-brand-800 cursor-pointer">
                  + Read full trip review
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Badges */}
        <div className="mt-14 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-500 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
            <span className="text-emerald-600">🟢</span> Tripadvisor <span className="text-amber-500">★★★★★</span> <span className="text-slate-400">300+</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
            <span className="text-red-500">🔴</span> Google Reviews <span className="text-amber-500">★★★★★</span> <span className="text-slate-400">100+</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
            <span className="text-emerald-500">⭐</span> Trustpilot <span className="text-amber-500">★★★★★</span> <span className="text-slate-400">99+</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
