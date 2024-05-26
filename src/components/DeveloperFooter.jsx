import React, { useEffect, useState } from "react";
import "../css/developerFooter.css";

export default function DeveloperFooter() {
  const developerLinks = [
    {
      link: "https://www.linkedin.com/in/ankit-singh-chauhan098/",
      icon: "assets/website-icons/linked-in-outline.svg",
      linkName: "linkedin",
    },
    {
      link: "https://github.com/ankitc248",
      icon: "assets/website-icons/github-box.svg",
      linkName: "github",
    },
    {
      link: "https://codepen.io/ankitc248",
      icon: "assets/website-icons/codepen-outline.svg",
      linkName: "codepen",
    }
  ];

  const quoteWords = ["care","love","passion","dedication"];
  const [quoteWord, setQuoteWord] = useState('care');

  useEffect(() => {
    setQuoteWord(quoteWords[Math.floor(Math.random()*quoteWords.length)]);
  },[quoteWords]);

  return (
    <div className="developer-footer">
      <div className="developer-block">
        <h4>developed with {quoteWord} by</h4>
        <div className="developer-links">
          {developerLinks.map((developerLink) => (
          <a
            href={developerLink.link}
            className={`link ${developerLink.linkName}-link`}
            target="_blank"
            rel="noreferrer"
            key={developerLink.linkName}
          >
            <span className="link-icon">
              <img src={developerLink.icon} alt={developerLink.linkName} />
            </span>
          </a>
          ))}
        </div>
      </div>
    </div>
  );
}
