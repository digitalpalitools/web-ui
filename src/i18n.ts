import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import PSC from '@pathnirvanafoundation/pali-script-converter'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: PSC.getLocaleForScript(PSC.Script.RO),
    backend: {
      loadPath: `${process.env.REACT_APP_RELATIVE_ROOT}/locales/{{ns}}.{{lng}}.json`,
    },
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: [...PSC.getSupportedLocales()],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
