import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowsLeftRight,
  faCalendarDays,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faClock,
  faCompass,
  faDragon,
  faDroplet,
  faGem,
  faHandshake,
  faHourglassHalf,
  faLandmark,
  faLeaf,
  faLocationDot,
  faMountain,
  faMountainSun,
  faPause,
  faPaw,
  faPlane,
  faPlay,
  faQuoteLeft,
  faSeedling,
  faStar,
  faSun,
  faTree,
  faTrophy,
  faUsers,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faLinkedin,
  faWhatsapp,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

export const REGION_ICONS = {
  Everest: faMountain,
  Annapurna: faLeaf,
  Langtang: faTree,
  Manaslu: faMountainSun,
  'Upper Mustang': faSun,
  Dolpo: faDroplet,
  Tibet: faLandmark,
  Bhutan: faDragon,
  Tanzania: faPaw,
};

export const DEFAULT_REGION_ICON = faLocationDot;

export const SOCIAL_ICONS = {
  facebook: faFacebook,
  instagram: faInstagram,
  linkedin: faLinkedin,
  twitter: faXTwitter,
  x: faXTwitter,
};

export const RegionIcon = ({ region, className = 'w-3.5 h-3.5' }) => (
  <FontAwesomeIcon icon={REGION_ICONS[region] || DEFAULT_REGION_ICON} className={className} />
);

export const ArrowRight = ({ className = 'w-3 h-3' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={className} />
);

export const ArrowLeft = ({ className = 'w-3 h-3' }) => (
  <FontAwesomeIcon icon={faArrowLeft} className={className} />
);

export {
  FontAwesomeIcon,
  faArrowLeft,
  faArrowRight,
  faArrowsLeftRight,
  faCalendarDays,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faClock,
  faCompass,
  faDragon,
  faDroplet,
  faFacebook,
  faGem,
  faGoogle,
  faHandshake,
  faHourglassHalf,
  faInstagram,
  faLandmark,
  faLeaf,
  faLinkedin,
  faLocationDot,
  faMountain,
  faMountainSun,
  faPause,
  faPaw,
  faPlane,
  faPlay,
  faQuoteLeft,
  faSeedling,
  faStar,
  faSun,
  faTree,
  faTrophy,
  faUsers,
  faWandMagicSparkles,
  faWhatsapp,
  faXTwitter,
};
