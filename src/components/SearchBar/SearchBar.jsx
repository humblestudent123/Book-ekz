import PropTypes from 'prop-types';

export default function SearchBar({ query, setQuery, placeholder = 'Книга или автор' }) {
  return (
    <div className="search-bar">
      <input
        data-testid="search-input"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
