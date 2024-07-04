export function union_arrays (x, y) {
  const obj = {}
  for (var i = x.length - 1; i >= 0; --i) { obj[x[i]] = x[i] }
  for (var i = y.length - 1; i >= 0; --i) { obj[y[i]] = y[i] }
  const res = []
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) // <-- optional
    { res.push(obj[k]) }
  }
  return res
}

export function arr_diff (arr1, arr2) {
  return arr1.filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)))
}

export const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
