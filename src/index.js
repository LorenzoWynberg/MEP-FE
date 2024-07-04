import './assets/css/vendor/bootstrap.min.css'
import './assets/css/vendor/bootstrap.rtl.only.min.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './assets/css/sass/componentsStyles/main.scss'
import './assets/css/sass/containerStyles/_main.scss'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import colors from './assets/js/colors'
import { envVariables } from './constants/enviroment'
import i18n from './i18n'
// const settings = localStorage.getItem('institutionSetting')
// const settingObj = settings & settings != ''? JSON.parse(settings) : {}
const color = colors.getColorId()// settingObj.color || 'orange'
// console.log({color, colorHex: colors.getColor()},'COLOR en Index')
// localStorage.setItem(envVariables.THEME_COLOR_STORAGE_KEY, color)
// const orange_theme = import ('./assets/css/sass/themes/gogo.theme.scss')
// const blue_theme = import (`./assets/css/sass/themes/gogo.blue.theme.scss`)
const render = () => {
   import(`./assets/css/sass/themes/gogo.blue.theme.scss`).then(_ => {
    require('./AppRenderer')
  })  
}
render()
