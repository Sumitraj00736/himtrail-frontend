import logo from '../../assets/logo.png';

const Footer = () => (
  <footer className="mt-16 bg-forest-800 text-white">
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <img src={logo} alt="Himtrail logo" className="w-10 h-10 object-contain" />
          <p className="font-display text-2xl">Himtrail</p>
        </div>
        <p className="text-sm text-white/80">
          Leave only footprints, take only memories. Sustainable adventure travel
          tailored to Himalayan journeys and beyond.
        </p>
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.2em] mb-3 text-white/80">Sustainability</p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>CO2 Neutral Operations</li>
          <li>Carry Me Bag Campaign</li>
          <li>Eco-Partner Lodges</li>
        </ul>
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.2em] mb-3 text-white/80">Contact</p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>hello@himtrail.com</li>
          <li>+1 (555) 014-7711</li>
          <li>Kathmandu · New York</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 text-center text-xs text-white/60 py-4">
      © 2026 Himtrail. All rights reserved.
    </div>
  </footer>
);

export default Footer;
