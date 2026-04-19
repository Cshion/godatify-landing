import { library, config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent FontAwesome from adding CSS automatically (we import it above)
config.autoAddCss = false;

// Import solid icons
import {
  faArrowLeft,
  faArrowRight,
  faChartLine,
  faChartBar,
  faChartPie,
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faLightbulb,
  faUserSecret,
  faBuilding,
  faExternalLinkAlt,
  faQuoteRight,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faServer,
  faBrain,
  faDatabase,
  faLaptopCode,
  faSnowflake,
  faSearch,
  faWind,
  faCube,
  faBolt,
  faStream,
  faMobileAlt,
  faCloud,
  faHandshake,
  faCheckCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

// Import brand icons
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faYoutube,
  faReact,
  faNodeJs,
  faPython,
  faRProject,
  faAws,
  faMicrosoft,
} from '@fortawesome/free-brands-svg-icons';

// Add all icons to library
library.add(
  // Solid icons
  faArrowLeft,
  faArrowRight,
  faChartLine,
  faChartBar,
  faChartPie,
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faLightbulb,
  faUserSecret,
  faBuilding,
  faExternalLinkAlt,
  faQuoteRight,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faServer,
  faBrain,
  faDatabase,
  faLaptopCode,
  faSnowflake,
  faSearch,
  faWind,
  faCube,
  faBolt,
  faStream,
  faMobileAlt,
  faCloud,
  faHandshake,
  faCheckCircle,
  faUsers,
  // Brand icons
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faYoutube,
  faReact,
  faNodeJs,
  faPython,
  faRProject,
  faAws,
  faMicrosoft
);

// Export for external use if needed
export { library };
