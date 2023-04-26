import { useState } from "react";

export function LanguageSelector({ languages, onLanguageChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  function handleLanguageSelect(language) {
    setSelectedLanguage(language);
    setShowDropdown(false);
    onLanguageChange(language);
  }

  return (
    <div className="language-selector">
      <button
        className="language-selector__button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img
          className="language-selector__icon"
          src={selectedLanguage.icon}
          alt={selectedLanguage.name}
        />
      </button>
      <div className={`language-selector__dropdown${showDropdown ? " show" : ""}`}>
        {languages.map((language) => (
          <a
            key={language.name}
            href="#"
            className="language-selector__option"
            onClick={() => handleLanguageSelect(language)}
          >
            <img src={language.icon} alt={language.name} />
          </a>
        ))}
      </div>
    </div>
  );
}
