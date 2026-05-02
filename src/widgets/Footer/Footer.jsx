import './Footer.css';
import { FOOTER_SECTIONS } from './footer.data';
import FooterSection from './FooterSection';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {FOOTER_SECTIONS.map((section) => (
          <FooterSection key={section.title} title={section.title} links={section.links} />
        ))}
      </div>


    </footer>
  );
}
