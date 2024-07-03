const SearchResult = ({ result, onResultClick }) => {
  const actors = result["#ACTORS"] !== "" ? result["#ACTORS"].split(",") : [];
  return (
    <div
      className="search-result"
      onClick={() => {
        onResultClick(result);
      }}
      tabIndex={0}
    >
      <div className="search-result-body">
        <div className="search-result-title">
          {result["#TITLE"]}
          {actors.length ? (
            <span className="actors">
              {actors.length &&
                actors.map((a) => {
                  return (
                    <span className="actor" key={a}>
                      {a.trim()}
                    </span>
                  );
                })}
            </span>
          ): null}
        </div>
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
