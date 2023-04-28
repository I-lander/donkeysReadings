import { useEffect, useState } from "react";

export function TranslateObject({ object, language }) {
  const [translatedObject, setTranslatedObject] = useState();
  useEffect(() => {
    return setTranslatedObject(object[language.code]);
  }, [language]);
  const lineBreakStyle = {
    whiteSpace: "pre-wrap",
  };
  
  return <div style={lineBreakStyle}>{translatedObject}</div>;
}
