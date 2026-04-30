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

      <div className="footer-bottom">
        <div className="footer-support">
          <div>Служба поддержки</div>
          <div>8 800 333 27 37</div>
          <div>support@readnext.ru</div>
        </div>

        <div className="footer-social">
          <span>VK</span>
          <span>YouTube</span>
          <span>Telegram</span>
        </div>

        <div className="footer-payments">
          <span>VISA</span>
          <span>MasterCard</span>
          <span>PayPal</span>
        </div>
      </div>
    </footer>
  );
}
