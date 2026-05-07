import { memo } from 'react';
import { Link } from 'react-router-dom';

const resolveFooterPath = (href) => (href.startsWith('/') ? href : `/library/${href}`);

function FooterSection({ title, links, activePathname }) {
  return (
    <div className="footer-section">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => {
          const targetPath = resolveFooterPath(link.href);
          const isActive = activePathname === targetPath;

          return (
            <li key={targetPath}>
              <Link
                to={targetPath}
                className={`footer-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(FooterSection);
