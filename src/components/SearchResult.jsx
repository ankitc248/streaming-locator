const SearchResult = ({ result, onResultClick }) => {
  return (
    <div
      className="search-result"
      onClick={() => {
        onResultClick(result);
      }}
      tabIndex={0}
    >
      <div className="search-result-body">
        <div className="search-result-title">{result["#AKA"]}</div>
        <div className="search-result-text">
          {Object.keys(result).includes("#YEAR") && (
            <span className="year">{result["#YEAR"]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
