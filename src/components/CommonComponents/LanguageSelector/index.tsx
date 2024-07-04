import React from 'react'
import OutlinedReactSelect from '../OutlinedReactSelect'
// import i18n from '../../../i18n'
import { useTranslation } from 'react-i18next'
import { Idioma } from '../../../api'
import { useDispatch, useSelector } from 'react-redux'
import { requestIdiomaList, setIdiomas } from '../../../redux/Idioma/actions'
const FB_LANG = 'es-CR'
const LanguageSelector = () => {
  const { t, i18n } = useTranslation()
  const [state, setState] = React.useState({ options: [], value: null })
  const dispatch = useDispatch()
  const idiomas = useSelector<any, any>(store => store.idioma)
  const initSelect = (idiomaList) => {
    const options = idiomaList?.map((i) => {
      const name = i.nombre.replace('.json', '')
      return {
        label: name,
        value: i.id
      }
    })
    const instLang = getInstitutionLanguage() // Si existe el localStorage de settings
    const selectedLang: any = localStorage.getItem('selectedLang')
    // debugger
    if (selectedLang) {
      const langParse = JSON.parse(selectedLang)
      const lang = options.find(i => i.value == langParse.idioma)
      if (lang) {
        setState({ value: lang, options })
        i18n.changeLanguage(lang.value)
      } else {
        setState({ value: options[0], options })
        i18n.changeLanguage(options[0].value)
      }
    } else if (instLang) {
      const lang = options.find(i => i.value == instLang.idioma)
      if (lang) {
        setState({ value: lang, options })
        i18n.changeLanguage(lang.value)
      } else {
        setState({ value: options[0], options })
        i18n.changeLanguage(options[0].value)
      }
    } else {
      // if(i18n.resolvedLanguage=''){
      const fallbackLang = options.find(i => i.value == FB_LANG)
      onChangeLang(FB_LANG)
      setState({ value: fallbackLang, options })
      const value = JSON.stringify({
        idioma: fallbackLang?.value
      })
      // debugger
      localStorage.setItem('selectedLang', value)
      // if (options?.length > 0) {
      // 	//setState({ value: options[0], options: options })
      // 	//i18n.changeLanguage(options[0].value)
      // }
    }
    /* if(i18n.resolvedLanguage=''){
			onChangeLang(options[0])
		} */
  }
  React.useEffect(() => {
    console.log(idiomas, 'Los Idiomas')
    if (!Array.isArray(idiomas) || idiomas.length == 0) return
    initSelect(idiomas)
  }, [idiomas])
  const getInstitutionLanguage = () => {
    try {
      const settings = localStorage.getItem('institutionSetting')
      if (!settings || settings == '') return
      const jsonSettings = JSON.parse(settings)
      return jsonSettings.idioma
    } catch (e) {
      console.log(e)
    }
  }
  const initLangList = () => {
    Idioma.getIdiomaList().then((response) => {
      const options = response?.map((i) => {
        const name = i.nombre.replace('.json', '')
        return {
          label: name,
          value: name
        }
      })
      const instLang = getInstitutionLanguage()
      if (instLang) {
        const lang = options.find(i => i)
      }
      if (options?.length > 0) {
        setState({ value: options[0], options })
        // i18n.changeLanguage(options[0].value)
      }
      /* if(i18n.resolvedLanguage=''){
				onChangeLang(options[0])
			} */
    })
  }
  const onChangeLang = (obj) => {
    i18n.changeLanguage(obj.value)
    setState({ ...state, value: obj })
    // debugger
    const value = JSON.stringify({
      idioma: obj?.value
    })
    // debugger
    localStorage.setItem('selectedLang', value)
  }
  React.useEffect(() => {
    // initLangList()
    // dispatch(requestIdiomaList())
    const idiomas = [{
      id: 'es-CR',
      nombre: 'Español Costa Rica.json',
      url: ''
    },
    // {
    //   id: 'es-NI',
    //   nombre: 'Español Nicaragua.json',
    //   url: ''
    // }, {
    //   id: 'fr-FR',
    //   nombre: 'Frances Francia.json',
    //   url: ''
    // }, 
    {
      id: 'eng-USA',
      nombre: 'English United States.json',
      url: ''
    },
    // {
    //   id: 'es-GT',
    //   nombre: 'Español Guatemala.json',
    //   url: ''
    // }
  ]
    dispatch(setIdiomas(idiomas))
  }, [])
  return (
    <>
      <OutlinedReactSelect
        isSearchable={false}
        onChange={onChangeLang}
        options={state.options}
        value={state.value}
      />
    </>
  )
}

export default LanguageSelector
