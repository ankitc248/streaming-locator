import { motion } from "framer-motion";
import { useState } from "react";
import * as CountryFlags from "country-flag-icons/react/1x1";

const flagComponents = Object.keys(CountryFlags).reduce((acc, key) => {
  acc[key] = CountryFlags[key];
  return acc;
}, {});

const DynamicFlag = ({ code }) => {
  const Component = flagComponents[code];
  return Component ? <Component width={20} height={15} /> : null;
};

const StreamCard = ({ values, index }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("tooltip");
  return (
    <motion.div
      className="stream-card"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, delay: index * 0.1 }}
    >
      <div className="title">
        <span className="text">{values.name}</span>
        <span className={`tooltip ${tooltipVisible ? "show" : ""}`}>
          {tooltipText}
        </span>
      </div>
      <div className="details">
        <span
          className="region"
          title="Region"
          onMouseEnter={(e) => {
            setTooltipText(e.target.title);
            setTooltipVisible(true);
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <DynamicFlag code={values.region} />
          {values.region}
        </span>
        <span
          className="format"
          title="Quality"
          onMouseEnter={(e) => {
            setTooltipText(e.target.title);
            setTooltipVisible(true);
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {values.format}
        </span>
        <span
          className="price"
          title={`${values.price ? "For rent" : "Subscription"}`}
          onMouseEnter={(e) => {
            setTooltipText(e.target.title);
            setTooltipVisible(true);
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {values.price ? "$" + values.price : "SUB"}
        </span>
        <span
          className="link"
          title="Watch now"
          onMouseEnter={(e) => {
            setTooltipText(e.target.title);
            setTooltipVisible(true);
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <a
            href={values.web_url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(e) => {
              setTooltipText(e.target.parentElement.title);
              setTooltipVisible(true);
            }}
            onMouseLeave={() => setTooltipVisible(false)}
            onFocus={(e) => {
              setTooltipText(e.target.parentElement.title);
              setTooltipVisible(true);
            }}
          >
            <img src="assets/media-icons/youtube-tv.svg" alt="watch now" className="icon svg"/>
          </a>
        </span>
      </div>
    </motion.div>
  );
};

export default StreamCard;
