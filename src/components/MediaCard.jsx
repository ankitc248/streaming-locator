import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MediaCard = ({ values }) => {
  const [moreDetails, setMoreDetails] = useState(false);
  const handleImageLoad = (e) => {
    let imageElement = e.target;
    let parentElement = e.target.parentElement;
    let loader = parentElement.querySelector(".search-result-image-loader");
    if (imageElement.src === "") loader.classList.add("stop-animation");
    imageElement.classList.add("opacity-1");
    loader.classList.remove("opacity-1");
  };
  const moreDetailsVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const detailVariants = {
    hidden: {
      opacity: 0,
      y: -5,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -5,
    },
  };

  return (
    <motion.div
      className={`media-card ${moreDetails ? "more-details-active" : ""}`}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <div className="background">
        <img src={values.image} alt="media" loading="lazy"></img>
        <span className="blur-overlay"></span>
      </div>
      <div className="body">
        <div className="search-result-media">
          <div className="search-image-container">
            <div
              className={`search-result-image-loader opacity-1 ${
                !values.image ? "stop-flashing" : ""
              }`}
            ></div>
            <img
              onLoad={handleImageLoad}
              src={values.image}
              alt="media"
              loading="lazy"
            />
          </div>
        </div>
        <div className="info">
          <span className="title">{values.realName}</span>
          <span className="genres">
            {values.genre.map((genre) => {
              return (
                <span className="genre" key={genre}>
                  {genre}
                </span>
              );
            })}
          </span>
          {values.description && (
            <span className="description">
              {decodeHTMLEntities(values.description)}
            </span>
          )}
          <AnimatePresence>
            {moreDetails && (
              <motion.span
                className="more-details"
                variants={moreDetailsVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
              >
                {values.duration && (
                  <motion.span className="detail" variants={detailVariants}>
                    <img
                      className="icon svg"
                      src="assets/media-icons/time-sand.svg"
                      alt="imdb"
                    ></img>
                    {convertDuration(values.duration)}
                  </motion.span>
                )}
                {values.contentRating && (
                  <motion.span className="detail" variants={detailVariants}>
                    <img
                      className="icon svg"
                      src="assets/media-icons/person.svg"
                      alt="imdb"
                    ></img>
                    {values.contentRating}
                  </motion.span>
                )}
                {values.datePublished && (
                  <motion.span className="detail" variants={detailVariants}>
                    <img
                      className="icon svg"
                      src="assets/media-icons/date-range.svg"
                      alt="imdb"
                    ></img>
                    {prettyDate(values.datePublished)}
                  </motion.span>
                )}
                {values.aggregateRating && (
                  <motion.span className="detail" variants={detailVariants}>
                    <a
                      href={values.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clean-link"
                    >
                      {values.aggregateRating.ratingValue}
                      <img
                        className="icon svg"
                        src="assets/media-icons/imdb.svg"
                        alt="imdb"
                      ></img>
                    </a>
                  </motion.span>
                )}
                {values.trailer && (
                  <motion.span className="detail" variants={detailVariants}>
                    <a
                      href={values.trailer.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clean-link"
                    >
                      Watch trailer
                      <img
                        className="icon svg"
                        src="assets/media-icons/youtube-play.svg"
                        alt="imdb"
                      ></img>
                    </a>
                  </motion.span>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="actions">
          <div className="media-type">
            {/* <a
              href="https://www.imdb.com/title/tt0365748/"
              target="_blank"
              rel="noopener noreferrer"
              className="imdb-link"
              title="IMDb page"
            >
              &#10532;
            </a> */}
            {values["@type"] === "Movie" && (
              <img
                src="assets/media-icons/movie-videos.svg"
                alt="movie"
                className="icon svg"
              ></img>
            )}
            {values["@type"] === "MusicVideoObject" && (
              <img
                src="assets/media-icons/music.svg"
                alt="series"
                className="icon svg"
              ></img>
            )}
            {values["@type"] === "TVEpisode" && (
              <img
                src="assets/media-icons/tv-television.svg"
                alt="series"
                className="icon svg"
              ></img>
            )}
          </div>
          <div>
            <button
              type="button"
              className="more-details-btn"
              onClick={() => setMoreDetails(!moreDetails)}
            >
              <img
                src="assets/media-icons/details-more.svg"
                alt="more details"
                className="icon svg"
              ></img>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const convertDuration = (duration) => {
  const regex = /PT(\d+H)?(\d+M)?/;
  const matches = duration.match(regex);
  const hours = matches[1] ? matches[1].slice(0, -1) : "0";
  const minutes = matches[2] ? matches[2].slice(0, -1) : "0";
  return `${hours}H ${minutes}M`;
};

const prettyDate = (date) => {
  const d = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("en-GB", options);
};

const decodeHTMLEntities = (str) => {
  const entities = {
    "&apos;": "'",
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
  };
  return str.replace(/&[a-z]+;/g, (match) => entities[match] || match);
};

export default MediaCard;
