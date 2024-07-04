import travelObject from './travelObject'

export default function search (value) {
  const reg = new RegExp(value.trim(), 'i')

  return {
    in: (array, props) => {
      return array.filter(element => {
        if (Array.isArray(props)) {
          return props.some(key => `${element[key] && element[key].toLowerCase && element[key].toLowerCase()}`.search(value.toLowerCase()) >= 0)
        }
        return reg.test(props ? travelObject(props, element) : element)
      })
    }
  }
}
