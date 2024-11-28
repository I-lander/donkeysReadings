import React from "react";

export const AppVisibilityButton = ({ appVisible, toggleAppVisibility }) => {
  return (
    <div>
      <button onClick={toggleAppVisibility} className="show-app-btn">
        {appVisible ? (
          <svg
            className="arrow arrow-up"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        ) : (
          <svg
            className="arrow arrow-down"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
};
