const SearchHistory = ({ history, onHistoryItemClick, setSearchHistory }) => {
    if (!history || history.length === 0 || history === "undefined") return null;
    return (
        <div className="search-history">
            <ul>
                {history.map((item, index) => (
                    <li key={index} onClick={(e) => { onHistoryItemClick(e, item.imdbID, item.name) }} className="search-result-title search-history-item">
                        {item.name}
                    </li>
                ))}
                <li className="search-result-title search-history-item clear-search-history" onClick={() => setSearchHistory([])}>
                    Clear search history
                    <img
                        src="assets/media-icons/history.svg"
                        alt="history"
                        className="icon svg"
                    />
                </li>
            </ul>
        </div>
    );
};

export default SearchHistory;
