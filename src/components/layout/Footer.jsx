import logo from '../../assets/logo.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-900 text-slate-300 border-t border-brand-800">
      {/* Newsletter Block */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 border-b border-brand-800/60 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-xl font-bold font-display text-white">Subscribe to our newsletter</h3>
          <p className="text-sm text-slate-400 mt-1">Get monthly trekking guides, seasonal safety reports, and special offers.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="rounded-xl border-brand-800 bg-brand-950/60 focus:border-sunrise-500 focus:ring-sunrise-500 text-sm text-white placeholder-slate-500 w-full px-4 py-2.5"
          />
          <button className="px-5 py-2.5 bg-sunrise-500 hover:bg-sunrise-600 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
        {/* Brand details */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="Himtrail logo" className="w-10 h-10 object-contain bg-white/5 p-1 rounded-xl" />
            <p className="font-display text-2xl font-bold text-white tracking-wide">Himtrail</p>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Leave only footprints, take only memories. Sustainable adventure travel
            tailored to Himalayan journeys, summit expeditions, and wilderness crossings.
          </p>
          
          {/* Social icons */}
          <div className="flex gap-4 mt-6">
            {['FB', 'IG', 'YT', 'PIN'].map((soc) => (
              <span key={soc} className="w-8 h-8 rounded-full bg-brand-850 hover:bg-sunrise-500 hover:text-white border border-brand-800 flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 hover:-translate-y-1">
                {soc}
              </span>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] mb-5 text-white">Sustainability</p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="hover:text-white transition-colors duration-200 cursor-pointer">CO2 Neutral Operations</li>
            <li className="hover:text-white transition-colors duration-200 cursor-pointer">Carry Me Bag Campaign</li>
            <li className="hover:text-white transition-colors duration-200 cursor-pointer">Eco-Partner Lodges</li>
            <li className="hover:text-white transition-colors duration-200 cursor-pointer">Porter Protection Code</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] mb-5 text-white">Contact</p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">📧 hello@himtrail.com</li>
            <li className="flex items-center gap-2">📞 +1 (555) 014-7711</li>
            <li className="flex items-center gap-2">📍 Kathmandu · New York</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-brand-800/40 text-center py-6 bg-brand-950/40 text-xs text-slate-500 relative">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Himtrail. All rights reserved.</span>
          <button 
            onClick={scrollToTop}
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-200"
          >
            Back to Top <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
