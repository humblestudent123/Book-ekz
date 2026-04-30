import PropTypes from 'prop-types';

export default function SearchBar({ query, setQuery }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Книга или автор"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};
