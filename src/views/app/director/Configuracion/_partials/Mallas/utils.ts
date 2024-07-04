import { sortBy } from 'lodash'
export const getElementFromObject = (obj: object, array: any[]) => {
  const returnArray = []
  Object.keys(obj).forEach((el) => {
    const findElement = array.find((item) => Number(item.id) === Number(el))
    if (findElement) {
      returnArray.push({ ...findElement, asignaturasAgrupadas: el })
    }
  })
  return sortBy(returnArray, 'nombre')
}
