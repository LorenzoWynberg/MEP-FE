import { envVariables } from '../constants/enviroment'

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    const A = a[key]; const B = b[key]
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1
    } else {
      return -1
    }
  })
  return array
}

export const getDateWithFormat = () => {
  const today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!

  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return dd + '.' + mm + '.' + yyyy
}

export const getCurrentTime = () => {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes()
}

export const getDirection = () => {
  let direction = envVariables.DEFAULT_DIRECTION
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction')
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl'
  }
}

export const setDirection = localValue => {
  let direction = 'ltr'
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue
  }
  localStorage.setItem('direction', direction)
}

export const orderOptions = (array, assignmentObject) => {
  /**
   * Needs an array value struct like [{ title: 'example' },{ title: 'example2' }]
   * in assignmentObject value struct like {
   *  title: 'Nombre'
   * }
   */
  const orderOptions = array.length && Object.keys(array[0]).map(key => ({
    column: key,
    label: typeof assignmentObject[key] === 'string' && assignmentObject[key]
  })).filter(option => option.label)
  return orderOptions || []
  // returns [ {column: 'title', label: 'Nombre'} ]
}
