import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import './CatalogTabs.css';

function CatalogTabs() {
  return (
    <nav className="catalog-tabs" aria-label="Каталог">
      <NavLink
        to="/library"
        className={({ isActive }) => `catalog-tabs__link ${isActive ? 'is-active' : ''}`}
      >
        Книги
      </NavLink>
      <NavLink
        to="/courses"
        className={({ isActive }) => `catalog-tabs__link ${isActive ? 'is-active' : ''}`}
      >
        Курсы
      </NavLink>
    </nav>
  );
}

export default memo(CatalogTabs);
