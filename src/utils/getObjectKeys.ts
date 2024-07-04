const getObjectChildKeys = (obj: object | any, key: string) => {
  const _obj = {}
  Object.keys(obj).forEach(el => {
    _obj[el] = obj[el][key] || null
  })
  return _obj
}

export default getObjectChildKeys
