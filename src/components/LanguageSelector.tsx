import { useEffect, useState } from 'react';

export interface Language {
  code: string;
  icon: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ languages, onLanguageChange }: LanguageSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  function getDefaultLanguage(): Language {
    return languages.find((lang) => lang.code === 'en') ?? languages[0];
  }

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => getDefaultLanguage());

  useEffect(() => {
    const detectedLanguage = navigator.language.substring(0, 2);
    const languageToSet =
      languages.find((lang) => lang.code === detectedLanguage) ?? getDefaultLanguage();
    setSelectedLanguage(languageToSet);
    onLanguageChange(languageToSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLanguageSelect(language: Language) {
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
          alt={selectedLanguage.code}
        />
      </button>
      <div className={`language-selector__dropdown${showDropdown ? ' show' : ''}`}>
        {languages.map((language) => (
          <a
            key={language.code}
            href="#"
            className="language-selector__option"
            onClick={() => handleLanguageSelect(language)}
          >
            <img src={language.icon} alt={language.code} />
          </a>
        ))}
      </div>
    </div>
  );
}
