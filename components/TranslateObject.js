import { useEffect, useState } from "react";

export function TranslateObject({ object, language }) {
  const [translatedObject, setTranslatedObject] = useState();
  useEffect(() => {
    return setTranslatedObject(object[language?.code]);
  }, [language]);
  
  return translatedObject;
}

export const getPlaceholderText = (language) => {
  switch (language) {
    case "en":
      return "Your question";
    case "fr":
      return "Votre question";
    default:
      return "...";
  }
};