const DEFAULT_THEME_NAME = 'blue' 
const DEFAULT_THEME_COLOR_VALUE = '#145388' 

const COLORES = [
  { color: '#F15C21', id: 'orange' },
  { color: '#145388', id: 'blue' },
  { color: '#34F321', id: 'green' },
  { color: '#F32121', id: 'red' }
]
const findColorNameByHex = (hex) => {
  const color = COLORES.find(i => i.color == hex?.toUpperCase())
  return color?.id || DEFAULT_THEME_NAME
}
const findColorValueByName = (name) => {
  const color = COLORES.find(i => i.id == name.toLowerCase())
  return color?.color || DEFAULT_THEME_COLOR_VALUE
}
const getDefaultThemeColorValue = ()=>{
  return findColorValueByName(DEFAULT_THEME_NAME)
}
const getColorObjectByName = (name) =>{
  return COLORES.find(i=>i.id == name)
}
const getDefaultColorObject = ()=>{
  return getColorObjectByName(DEFAULT_THEME_NAME)
}
export default COLORES
export { getColorObjectByName, getDefaultColorObject,getDefaultThemeColorValue, findColorNameByHex, findColorValueByName, DEFAULT_THEME_COLOR_VALUE, DEFAULT_THEME_NAME }
