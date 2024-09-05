import "./App.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MediaCard from "./components/MediaCard";
import StreamCard from "./components/StreamCard";
import SearchResult from "./components/SearchResult";
import NetworkError from "./components/NetworkError";
import SearchHistory from "./components/SearchHistory";
import useLocalStorage from "use-local-storage";
const IMDB_API_URL = "https://search.imdbot.workers.dev";
const WATCHMODE_API_KEY = "VLXzZRPpfTpvjWdqU4Rj8ZIFTzDJn1fq2iFjrrJ2";
const WATCHMODE_API_URL = "https://api.watchmode.com/v1";
function App() {
  const minimumSearchLength = 2;
  const [search, setSearch] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Severance");
  const [searched, setSearched] = useState(false);
  const [mediaID, setMediaID] = useState(0);
  const [networkError, setNetworkError] = useState();
  const [mediaDetails, setMediaDetails] = useState();
  const [streamingResults, setStreamingResults] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamsLoading, setStreamsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [searchHistory, setSearchHistory] = useLocalStorage(
    "searchHistory",
    []
  );
  const searchInput = useRef(null);
  useEffect(() => {
    const placeholderValues = [
      "The Godfather",
      "The Lord of the rings",
      "12 Angry Men",
      "It's Always Sunny in Philadelphia",
      "Friends",
    ];
    const placeholderInterval = setInterval(() => {
      let newPlaceholder;
      do {
        newPlaceholder =
          placeholderValues[
            Math.floor(Math.random() * placeholderValues.length)
          ];
      } while (newPlaceholder === searchPlaceholder);
      setSearchPlaceholder(newPlaceholder);
    }, 1500);
    return () => clearInterval(placeholderInterval);
  }, [searchPlaceholder]);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        setShowResults(false);
      }
    });
    return () => {
      document.body.removeEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
          setShowResults(false);
        }
      });
    };
  });

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    if (searchTerm.length <= minimumSearchLength) {
      clearTimeout(debounceTimeout.current);
      setIsLoading(false);
      setShowResults(false);
      setSearchResults([]);
      setNetworkError(false);
      return;
    }
    setShowResults(false);
    setNetworkError(false);
    debouncedSearch(searchTerm);
  };

  const fetchSearchResults = async (searchTerm) => {
    const searchResults = await axios.get(`${IMDB_API_URL}/?q=${searchTerm}`);
    return searchResults.data;
  };

  const handleInputFocus = (e) => {
    // setShowHistory(false);
    if (e.target.value.length >= minimumSearchLength) {
      setShowResults(true);
    }
  };

  const debouncedSearch = (searchText) => {
    // setShowHistory(false);
    setIsLoading(true);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await fetchSearchResults(searchText);
        setSearchResults(results.description);
        setIsLoading(false);
        setShowResults(true);
      } catch (e) {
        setSearchResults([]);
        setNetworkError(true);
        setShowResults(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimeout.current);
  }, []);

  const handleResultClick = async (data) => {
    setShowResults(false);
    // setShowHistory(false);
    setStreamsLoading(true);
    setSearch(data["#AKA"]);
    setSearched(true);
    const newMediaID = data["#IMDB_ID"];
    setMediaID(newMediaID);
    const mediaDetailsResponse = await performMediaDetailsSearch(
      newMediaID,
      data["#AKA"]
    );
    if (mediaDetailsResponse.success) {
      const streamingResponse = await performStreamsSearch(newMediaID);
      if (streamingResponse.success) {
        streamingResponse.data = mergeBySourceId(streamingResponse.data);
        mediaDetailsResponse.data.short.realName = data["#AKA"];
        mediaDetailsResponse &&
          setMediaDetails(mediaDetailsResponse.data.short);
        streamingResponse && setStreamingResults(streamingResponse.data);
      } else {
        setNetworkError(streamingResponse);
      }
    } else {
      setNetworkError(mediaDetailsResponse);
    }
    setStreamsLoading(false);
  };

  const performStreamsSearch = async (id) => {
    try {
      const response = await axios.get(
        `${WATCHMODE_API_URL}/title/${id}/sources?apiKey=${WATCHMODE_API_KEY}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      let errorMessage = "";
      let headers = null;
      if (error.response) {
        errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        headers = error.response.headers;
        if (error.response.data.statusCode === 404)
          return {
            success: true,
            data: [],
          };
      } else if (error.request) {
        errorMessage = "Error: No response received from the server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      return {
        success: false,
        message: errorMessage,
        headers: headers,
      };
    }
  };

  const handleHistoryItemClick = (e, id, name) => {
    const data = { "#AKA": name, "#IMDB_ID": id };
    handleResultClick(data);
  };

  const performMediaDetailsSearch = async (id, name = "") => {
    try {
      const response = await axios.get(`${IMDB_API_URL}/?tt=${id}`);
      addToSearchHistory(name, id);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      let errorMessage = "";
      let headers = null;
      if (error.response) {
        errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        headers = error.response.headers;
      } else if (error.request) {
        errorMessage = "Error: No response received from the server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      errorMessage =
        "Facing network issues from our side. Please try again later.";
      return {
        success: false,
        message: errorMessage,
        headers: headers,
      };
    }
  };

  const addToSearchHistory = (name, id) => {
    if (name.trim() !== "") {
      const existingIndex = searchHistory.findIndex(
        (item) => item.imdbID === id
      );
      let updatedHistory;

      if (existingIndex !== -1) {
        // Remove the old entry
        updatedHistory = [
          ...searchHistory.slice(0, existingIndex),
          ...searchHistory.slice(existingIndex + 1),
        ];
      } else {
        updatedHistory = [...searchHistory];
      }

      // Add the new entry at the beginning
      const newEntry = { name, imdbID: id };
      if (updatedHistory.length >= 5) {
        updatedHistory = [newEntry, ...updatedHistory.slice(0, 4)];
      } else {
        updatedHistory = [newEntry, ...updatedHistory];
      }

      setSearchHistory(updatedHistory);
    }
  };
  return (
    <div className="App">
      <div className="focus-background"></div>
      <div className="app-container">
        <div className={`search-container`}>
          <div className="search-box-header">I want to stream</div>
          <div className={`search-box ${searched ? "searched" : ""}`}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`search-input ${showResults ? "with-results" : ""}`}
              onChange={handleSearch}
              onFocus={handleInputFocus}
              value={search}
              required
              disabled={searched}
              ref={searchInput}
            />
            <span className={`loading-icon ${!isLoading ? "hide" : ""}`}>
              <span className="loader"></span>
            </span>
            <motion.button
              type="button"
              className="clear-btn"
              onClick={() => {
                setSearch("");
                setSearched(false);
                setStreamingResults();
                setMediaDetails();
                setNetworkError();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &#10005;
            </motion.button>
          </div>
          {showResults && (
            <div className="search-results scrollable">
              {networkError && (
                <div className="no-results">
                  Facing network issues from our side. Please try again later.
                </div>
              )}
              {searchResults.length ? (
                searchResults.map((result) => {
                  if (
                    Object.keys(result).includes("#YEAR") &&
                    Object.keys(result).includes("#AKA")
                  ) {
                    return (
                      <SearchResult
                        result={result}
                        key={result["#IMDB_ID"]}
                        onClick={() => setShowResults(false)}
                        onResultClick={handleResultClick}
                      />
                    );
                  } else return null;
                })
              ) : (
                <div className="no-results">No matching media found</div>
              )}
            </div>
          )}
          {showHistory && (
            <SearchHistory
              onClick={() => searchInput.current.onFocus()}
              history={searchHistory}
              onHistoryItemClick={handleHistoryItemClick}
              setSearchHistory={setSearchHistory}
            />
          )}
        </div>
        <div className="streaming-container">
          <span className={`loading-icon ${!streamsLoading ? "hide" : ""}`}>
            <span className="loader"></span>
          </span>
          {networkError && <NetworkError values={networkError} />}
          <AnimatePresence>
            {mediaDetails && <MediaCard values={mediaDetails} key={mediaID} />}
          </AnimatePresence>
          <AnimatePresence>
            {streamingResults && <StreamingResults values={streamingResults} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
const StreamingResults = ({ values }) => {
  return (
    <>
      {values && values.length > 0 && (
        <h2 className="stream-count">
          Found {values.length} streaming{" "}
          {values.length > 1 ? "providers" : "provider"}
        </h2>
      )}
      <motion.div className="streaming-results">
        {values && values.length === 0 && (
          <div className="empty-result stream-card">
            <div className="title">
              <span className="special-icon">
                <img
                  src="assets/media-icons/cute-pirate.svg"
                  alt="network error"
                  className="icon svg big-icon"
                />
              </span>
              <span className="text">No streaming provider found.</span>
              <span className="text">
                Time to do it the old fashioned way mate.
              </span>
            </div>
          </div>
        )}
        {values && values.length
          ? values.map((source, index) => (
              <StreamCard values={source} key={index} index={index} />
            ))
          : null}
      </motion.div>
    </>
  );
};
export default App;

const mergeBySourceId = (arr) => {
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (!seen.has(item.source_id)) {
      seen.add(item.source_id);
      result.push(item);
    }
  }
  return result;
};
