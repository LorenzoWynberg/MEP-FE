import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import backend from 'i18next-http-backend'
import { Idioma } from '../api'
import esCR from './langs/es-CR_Español Costa Rica.json'
import esNI from './langs/es-NI_Español Nicaragua.json'
import frFr from './langs/fr-Fr_Frances Francia.json'
import engUsa from './langs/eng-USA_English United States.json'
import esGt from './langs/es-GT_Español Guatemala.json'
import esMep from './langs/es-CR-MEP.json'
i18n.use(initReactI18next) // bind react-i18next to the instance
  .use(backend)
  .init({
    load: 'currentOnly',
    fallbackLng: 'es-CR-MEP',
    fallbackNS: [],
    ns: [],
    initImmediate: false,
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    resources: {
      'es-CR': { translation: esCR },
      'es-NI': { translation: esNI },
      'fr-FR': { translation: frFr },
      'eng-USA': { translation: engUsa },
      'es-GT': { translation: esGt },
      'es-CR-MEP': { translation: esMep },
    },
    // resources: {
    // 'es-CR': esCR,
    // 'fb': {translation: {}},
    // 'en-US': enUS
    // },
    // lng: 'es-CR', // if you're using a language detector, do not define the lng option
    // react i18next special options (optional)
    // override if needed - omit if ok with defaults
    /*
			react: {
			bindI18n: 'languageChanged',
			bindI18nStore: '',
			transEmptyNodeValue: '',
			transSupportBasicHtmlNodes: true,
			transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
			useSuspense: true,
			}
    	*/
    backend: {
      loadPath: '{{lng}}',
      request: function (options, url, payload, callback) {
        /** FUNCION DE CALLBACK
				callback(err,res)
					res:{status,data}should be an object with a 'status' property and a 'data' property containing a stringified object instance beeing the key:value translation pairs for the requested language and namespace, or null in case of an error.
				*/

        // console.log({options, payload, url}, "LA URL DE LANG")
        Idioma.getIdiomaList().then((response) => {
          const langObj = response.find((i) => i.id == url)

          fetch(`${langObj.url}`)
            .then((r) => r.json())
            .then((obj) => {
              callback(null, { status: 200, data: obj })
            })
            .catch((e) => {
              callback(e, { status: 501, data: null })
            })
        })
      }
    }
  })

export default i18n
