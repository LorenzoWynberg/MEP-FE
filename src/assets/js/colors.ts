import colorList,{getDefaultThemeColorValue, getDefaultColorObject} from '../../constants/ColorList'
import { setTemaValue } from 'Redux/tema/actions'
import StoreConfigurator from '../../redux/StoreConfigurator'
const store = StoreConfigurator.getStore()
const { tema } = store.getState()

const getColor = () => {
  try {
    const settings = localStorage.getItem('institutionSetting')
    if (!settings || settings == '') return getDefaultThemeColorValue()

    const settingsObj = JSON.parse(settings)
    if (!settingsObj.color) return getDefaultThemeColorValue()
    const color = settingsObj.color
    const colorHex = colorList.find(i => i.id == color).color
 
    return colorHex || getDefaultThemeColorValue().color
  } catch (e) {
    return getDefaultThemeColorValue().color
  }
}

const getColorId = () => {
  try {
    const settings = localStorage.getItem('institutionSetting')
    if (!settings || settings == '') return getDefaultColorObject()?.id
    const settingsObj = JSON.parse(settings)
    const color = settingsObj.color

    return color || getDefaultColorObject()?.id
  } catch (e) {
    console.log(e)
    return getDefaultColorObject()?.id
  }
}

const temaObj = {
  ...tema,
  primary: getColor(),
  cambiarTema: (obj) => store.dispatch(setTemaValue(obj)),
  getColor,
  getColorId,
  color: {
    primary: '#145388',
    secondary: '#109ed9',
    gray: '#D4D4D4',
    darkGray: '#575757',
    opaqueGray: '#dbdbdb', // Se usa para los border
    error: '#bd0505',
    green:"#28a745",
    orange:"#fd7e14",
    yellow:"#D6E55A"
  } 
}


export default temaObj
/*
const Colors = () => {
	const dispatch = useDispatch()
	const tema = useSelector((store:any)=>{
		return store.tema
	})
	console.log("EL TEMA!!!!!!!!!!!!",tema)
	return {
		...tema,
		cambiarTema: (obj)=>dispatch(setTemaValue(obj))
		primary: '#F15C21', //'#145388',
		secondary: '#109ed9',
		gray: '#D4D4D4',
		darkGray: '#575757',
		opaqueGray: '#dbdbdb', // Se usa para los border
		error: '#bd0505'
	}
}

export default Colors */


