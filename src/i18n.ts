import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import PSC from '@pathnirvanafoundation/pali-script-converter'

const getSupportedLocales = () => {
  const sInfos = [...PSC.PaliScriptInfo.keys()].map((k) => PSC.PaliScriptInfo.get(k)?.[3])
  const ls = new Set(sInfos.map((si: any) => si.locale))
  return [...ls]
}

const fallbackLocale = (PSC.PaliScriptInfo.get(PSC.Script.RO)?.[3] as any).locale

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallbackLocale,
    backend: {
      loadPath: `${process.env.REACT_APP_RELATIVE_ROOT}/locales/{{lng}}/{{ns}}.json`,
    },
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: getSupportedLocales(),
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
