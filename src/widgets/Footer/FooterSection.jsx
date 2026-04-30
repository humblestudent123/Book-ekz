export default function FooterSection({ title, links }) {
  return (
    <div className="footer-section">
      <h4>{title}</h4>

      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}