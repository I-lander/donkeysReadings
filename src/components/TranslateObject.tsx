import { useEffect, useState } from 'react';
import type { TranslatedText } from '../constants/constants';
import type { Language } from './LanguageSelector';

interface TranslateObjectProps {
  object: TranslatedText;
  language?: Language;
}

export function TranslateObject({ object, language }: TranslateObjectProps) {
  const [translatedObject, setTranslatedObject] = useState<string>();

  useEffect(() => {
    setTranslatedObject(language ? object[language.code] : undefined);
  }, [object, language]);

  return <>{translatedObject}</>;
}

export const getPlaceholderText = (language: string): string => {
  switch (language) {
    case 'en':
      return 'Your question';
    case 'fr':
      return 'Votre question';
    default:
      return '...';
  }
};
