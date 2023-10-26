import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './lang/en.json';
import it from './lang/it.json';
import es from './lang/es.json';
import de from './lang/de.json';
import fr from './lang/fr.json';
import cz from './lang/cz.json';

// Imposta la lingua di default
i18n.defaultLocale = 'en';

// Definisci un array di codici lingua supportati
const supportedLanguages = ['it', 'es', 'de', 'fr', 'cz'];

// Ottieni la lingua corrente del telefono
const phoneLanguage = Localization.locale;

// Itera attraverso gli array di codici lingua supportati e imposta la lingua corrente se trovata
let languageFound = false;
supportedLanguages.forEach((lang) => {
  if (phoneLanguage.startsWith(lang)) {
    i18n.locale = lang;
    languageFound = true;
  }
});

// Se la lingua non è stata trovata, imposta la lingua predefinita
if (!languageFound) {
  i18n.locale = i18n.defaultLocale;
}

// Imposta le traduzioni
i18n.translations = {
  en,
  it,
  es,
  de,
  fr,
  cz
  // Aggiungi altre lingue qui se necessario
};

export default i18n;
