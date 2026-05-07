import './Footer.css';
import { useLocation } from 'react-router-dom';
import { FOOTER_SECTIONS } from './footer.data';
import FooterSection from './FooterSection';

export default function Footer() {
  const { pathname } = useLocation();
  const activePathname = pathname.replace(/\/+$/, '') || '/';

  return (
    <footer className="footer">
      <div className="footer-top">
        {FOOTER_SECTIONS.map((section) => (
          <FooterSection
            key={section.title}
            title={section.title}
            links={section.links}
            activePathname={activePathname}
          />
        ))}
      </div>
    </footer>
  );
}
