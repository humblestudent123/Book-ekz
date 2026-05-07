import { memo } from 'react';
import PropTypes from 'prop-types';
import './SkeletonGrid.css';

function SkeletonGrid({ count = 6 }) {
  return (
    <section className="shelf-section" aria-label="Загрузка">
      <div className="skeleton-heading" />
      <div className="skeleton-grid" aria-hidden="true">
        {Array.from({ length: count }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-card__media" />
            <div className="skeleton-card__line skeleton-card__line--wide" />
            <div className="skeleton-card__line" />
            <div className="skeleton-card__chips" />
          </div>
        ))}
      </div>
    </section>
  );
}

SkeletonGrid.propTypes = {
  count: PropTypes.number,
};

export default memo(SkeletonGrid);
